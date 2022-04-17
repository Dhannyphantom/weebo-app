import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import AppPickerItem from "./AppPickerItem";

const { height } = Dimensions.get("window");

const PopModal = ({
  modalVis,
  data,
  handleDropdown,
  numColumns = 3,
  setModalVis,
}) => {
  return (
    <Modal
      transparent
      visible={modalVis}
      statusBarTranslucent
      onRequestClose={() => setModalVis({ vis: false, type: null })}
      animationType="fade"
    >
      <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
        <TouchableOpacity
          onPress={() => setModalVis({ vis: false, type: null })}
          style={styles.modalOuter}
        ></TouchableOpacity>
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <AppButton
              title="Close"
              bare
              style={styles.modalBtn}
              onPress={() => setModalVis({ vis: false, type: null })}
            />
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AppPickerItem
                  text={item.title}
                  desc={item.description}
                  example={item.example}
                  onPress={() => {
                    setModalVis({ vis: false, type: null });
                    handleDropdown(item.title);
                  }}
                />
              )}
              numColumns={numColumns}
              listKey="dropDown"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    minHeight: height * 0.6,
    maxHeight: height * 0.8,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },

  modalBtn: {
    width: "40%",
    marginTop: 10,
    alignSelf: "center",
  },
  modalBg: {
    // flex: 1,
    // backgroundColor: "rgba(0,0,0,0.09)",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalOuter: {
    // flex: 0.43,
    // backgroundColor: "rgba(0,0,0,0.09)",
  },
});
export default PopModal;
