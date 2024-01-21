import React from "react";
import { View, StyleSheet, FlatList, Animated, Dimensions } from "react-native";
import FeedImage from "./FeedImage";

const { width, height } = Dimensions.get("window");
const SLIDER_WIDTH = width;
const SLIDER_CONTAINER_WIDTH = width * 0.9;
const SLIDER_MARGIN = width * 0.05;

const ITEM_WIDTH = width * 0.87;

const AppCarousel = ({
  data,
  imager: { feed, showMediaFunc, handleLike, liked },
  full,
  activeSetter,
  translator,
}) => {
  //

  const handleCarouselScroll = ({ contentOffset }) => {
    const scrollerX = contentOffset.x;
    const scrollCalc =
      Math.round(scrollerX / (SLIDER_CONTAINER_WIDTH + SLIDER_MARGIN)) + 1;

    activeSetter.setActiveSlide(scrollCalc);
  };
  //
  const renderAppCarousel = ({ item, index }) => {
    const addMargin = data.length - 1 === index;
    return (
      <Animated.View
        style={{
          width: full ? SLIDER_WIDTH : SLIDER_CONTAINER_WIDTH,
          marginRight: !addMargin ? SLIDER_MARGIN : 0,
          alignItems: "center",
          justifyContent: "center",
          height: height * 0.55,
          borderRadius: 15,
        }}
      >
        <FeedImage
          translator={translator}
          feed={feed}
          showMediaFunc={showMediaFunc}
          setAspectRatio={false}
          image={item}
          style={full ? { width: width } : { width: SLIDER_CONTAINER_WIDTH }}
          handleLike={handleLike}
          full={full}
          liked={liked}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderAppCarousel}
        onScroll={({ nativeEvent }) => handleCarouselScroll(nativeEvent)}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={
          full
            ? SLIDER_WIDTH + SLIDER_MARGIN
            : SLIDER_CONTAINER_WIDTH + SLIDER_MARGIN
        }
        pagingEnabled
        decelerationRate={0.2}
        initialNumToRender={5}
        contentContainerStyle={{
          alignSelf: "center",
        }}
        maxToRenderPerBatch={8}
        overScrollMode="never"
        horizontal
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default AppCarousel;
