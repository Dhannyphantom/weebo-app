import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Context as CharContext } from "../config/CharContext";

import AppText from "./AppText";
import AppButton from "./AppButton";
import LoaderImage from "./LoaderImage";
import colors from "../constants/colors";
import Separator from "./Separator";
import AlertModal from "./AlertModal";
import PopMessage from "./PopMessage";
import ActivityIndicator from "./ActivityIndicator";

const { width } = Dimensions.get("window");

const InstanceInvites = ({ data, instance, setVisible }) => {
  /// data = [...]
  const navigation = useNavigation();
  const { inviteActions } = useContext(CharContext);
  const newData =
    data &&
    data.map((obj) => {
      return {
        ...obj,
        loading: false,
      };
    });

  const [alertModal, setAlertModal] = useState({ visible: false });
  const [instanceData, setInstanceData] = useState(newData);
  const [popper, setPopper] = useState({ vis: false });

  const handleOkAlert = (type = "decline", dataID, groupID) => {
    const data = alertModal.data;
    const isDecline = type === "decline";
    handleLoader(!isDecline ? dataID : data?._id, true);
    const sendData = {
      group: isDecline ? data.instance._id : groupID,
      character: instance.id,
      actionType: type,
      from: instance.type,
    };

    inviteActions(
      sendData,
      (resData) => {
        handleInviteFilter(isDecline ? data._id : dataID, type);
      },
      (err) => {
        console.log(err);
        handleLoader(data._id, false);
      }
    );
  };

  const handleLoader = (id, bool) => {
    const copyInstanceData = [...instanceData];
    const index = copyInstanceData.findIndex((obj) => obj._id == id);
    copyInstanceData[index] = { ...copyInstanceData[index], loading: bool };
    setInstanceData(copyInstanceData);
  };

  const handleInviteFilter = (id, type) => {
    setInstanceData(instanceData.filter((obj) => obj._id != id));
    if (type === "accept") {
      setPopper({
        vis: true,
        msg: "Joined group successfully",
        type: "success",
      });
    }
  };

  const RenderInvites = ({ item }) => {
    //
    const handleNav = () => {
      const viewRoomData = {
        instance: "group",
        instanceID: item.instance._id,
      };
      if (instance.type === "character") {
        navigation.navigate("Room", {
          roomID: item.instance._id,
          data: viewRoomData,
          instance: item,
        });
      } else if (instance.type === "group") {
        navigation.navigate("Character", { item: viewRoomData.instanceID });
      }
      setVisible && setVisible();
    };

    const handleActions = (type, item) => {
      if (type === "accept") {
        handleOkAlert("accept", item._id, item?.instance?._id);
      } else if (type === "decline") {
        setAlertModal({
          visible: true,
          title: "DECLINE INVITE",
          message: `Are you sure ${
            instance.type === "character"
              ? instance?.name?.toUpperCase()
              : item.instance.name.toUpperCase()
          } is not a member of the ${
            instance.type === "character"
              ? item.instance.name.toUpperCase()
              : instance.name.toUpperCase()
          } group?`,
          btn: "YES",
          type: "decline",
          data: item,
        });
      } else if (type === "cancel") {
        setAlertModal({
          visible: true,
          title: "CANCEL REQUEST",
          message: `Do you really want to cancel this operation?`,
          btn: "YES",
          type: "cancel",
          data: item,
        });
      }
    };

    let showTypeA = false,
      showTypeB = false;
    if (
      (item?.action === "invite" && instance.type === "character") ||
      (item?.action === "join" && instance.type === "group")
    ) {
      showTypeA = true;
    }
    if (
      (item?.action === "invite" && instance.type === "group") ||
      (item?.action === "join" && instance.type === "character")
    ) {
      showTypeB = true;
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleNav}
          style={styles.content}
        >
          <LoaderImage
            loading={item.loading}
            image={item.instance?.cover_photo}
          />
          {!item.loading && (
            <View style={styles.overlay}>
              <AppText style={styles.title} size="xlarge" bold>
                {item?.instance?.name}
              </AppText>
              {instance.type === "character" && (
                <AppText style={styles.title} size="large" bold>
                  {item?.instance?.characters?.length} characters
                </AppText>
              )}
              {instance.type === "group" && (
                <>
                  <AppText style={styles.title} size="large" bold>
                    {item?.instance?.followers?.length} followers
                  </AppText>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>
        <Separator h={1} />
        {showTypeA && (
          <View style={styles.row}>
            <AppButton
              title="Accept"
              onPress={() => handleActions("accept", item)}
              bare
              RIcon="check"
            />
            <AppButton
              title="Decline"
              onPress={() => handleActions("decline", item)}
              bare
              bareRed
              RIcon="cancel"
            />
          </View>
        )}
        {showTypeB && (
          <View style={styles.row}>
            <AppText bold size="large" style={styles.pending}>
              Pending...
            </AppText>
            <AppButton
              title="Cancel Request"
              onPress={() => handleActions("cancel", item)}
              bare
              bareRed
              RIcon="cancel"
            />
          </View>
        )}
        <Separator h={1} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppText
        size="large"
        style={{ textAlign: "center", marginBottom: 12 }}
        bold
      >
        GROUP INVITES
      </AppText>
      <FlatList
        data={instanceData}
        keyExtractor={(item) => item._id}
        renderItem={RenderInvites}
        ListEmptyComponent={
          <ActivityIndicator type="isEmpty" visible={true} text="NO INVITES" />
        }
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
        onPress={handleOkAlert}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 30,
  },
  content: {
    width: width * 0.9,
    alignSelf: "center",
  },
  title: {
    textTransform: "capitalize",
    color: colors.white,
    lineHeight: 22,
  },
  pending: {
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
});
export default InstanceInvites;
