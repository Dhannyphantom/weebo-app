import React from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ChallengeCard from "./ChallengeCard";
import FeedHeader from "./FeedHeader";
import Separator from "./Separator";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width } = Dimensions.get("window");
const Shows = ({ data, searchResult, title, series, show }) => {
  const navigation = useNavigation();

  const header = series ? "Show" : "Character";
  if (!data) {
    return null;
  }
  const verifiedCharacters = data?.characters?.filter((obj) => obj.verified);
  const unVerifiedCharacters = data?.characters?.filter((obj) => !obj.verified);

  // console.log("SHOWS +", verifiedCharacters);
  // console.log("SHOWS -", unVerifiedCharacters);

  const RenderFooter = () => {
    if (!unVerifiedCharacters[0]) return null;
    return (
      <View style={styles.footerContainer}>
        <View>
          <AppText style={{ color: colors.medium, padding: 10 }}>
            UNVERIFIED CHARACTERS
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 5,
            }}
          >
            <MaterialCommunityIcons
              name="circle"
              size={width * 0.03}
              color={colors.light}
            />
            <Separator style={styles.line} h={1} />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {unVerifiedCharacters.map((item, idx) => (
            <ChallengeCard
              image={item.cover_photo}
              avatar={item.owner && item.owner.avatar}
              name={item.dpName}
              id={item._id}
              key={idx}
              isVerified={item.verified}
              bScale={3}
              subTitleStyle={{ marginTop: 2.5 }}
              owner={item.owner}
              show={item.show.name_j ?? item.show.name_e}
              followers={item.followers}
              onPress={() =>
                navigation.navigate("Character", { item: item._id })
              }
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      {show && (
        <View>
          <FeedHeader
            show={data}
            feederID={data._id}
            follow="following"
            followers={data.followers.length}
          />
          <FlatList
            // data={data?.characters}
            data={verifiedCharacters}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            // overScrollMode="never"
            ListFooterComponent={RenderFooter}
            contentContainerStyle={{ alignItems: "center" }}
            renderItem={({ item }) => (
              <>
                <ChallengeCard
                  image={item.cover_photo}
                  avatar={item.owner && item.owner.avatar}
                  name={item.dpName}
                  id={item._id}
                  isVerified={item.verified}
                  bScale={3}
                  subTitleStyle={{ marginTop: 2.5 }}
                  owner={item.owner}
                  show={item.show.name_j ?? item.show.name_e}
                  followers={item.followers}
                  onPress={() =>
                    navigation.navigate("Character", { item: item._id })
                  }
                />
              </>
            )}
          />
          <Separator h={1} />
        </View>
      )}

      {searchResult && (
        <View>
          <FeedHeader challenge={title ? title : `${header} Search Results`} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <>
                <ChallengeCard
                  image={item.cover_photo}
                  avatar={!series ? item.owner.avatar : item.app_creator.avatar}
                  name={item.name_j ?? item.name_e ?? item.dpName}
                  seriesChar={series ? item.followers : null}
                  series={series}
                  id={item._id}
                  show={
                    !series ? item.show.name_j ?? item.name_e : item.creator
                  }
                  followers={item.followers}
                  onPress={() =>
                    navigation.navigate(header, { show: item, item: item._id })
                  }
                />
              </>
            )}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginLeft: 5,
    marginRight: 15,
    borderRadius: width * 0.03,
    alignSelf: "center",
  },
  line: {
    minWidth: "100%",
  },
});

export default Shows;
