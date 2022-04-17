import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import FeedImage from "./FeedImage";
import colors from "../constants/colors";
import AppCarousel from "./AppCarousel";

const screen = Dimensions.get("window");
const CarouselDisplay = ({
  feed,
  activeSlide,
  setActiveSlide,
  activeSetter,
  showMediaFunc,
  liked,
  handleLike,
}) => {
  const carouselRef = useRef(null);
  const sliderWidth = screen.width;
  const itemWidth = screen.width * 0.87;

  const renderCarousel = ({ item }) => {
    return (
      <View style={styles.container}>
        <FeedImage
          feed={feed}
          showMediaFunc={showMediaFunc}
          image={item}
          handleLike={handleLike}
          liked={liked}
        />
      </View>
    );
  };

  return (
    <View style={{ alignItems: "center" }}>
      {/* <Carousel
        ref={carouselRef}
        data={feed.posts}
        sliderWidth={sliderWidth}
        layout="default"
        itemWidth={itemWidth}
        onSnapToItem={(index) => setActiveSlide(index)}
        keyExtractor={(item, index) => item + index}
        renderItem={renderCarousel}
      />
      <Pagination
        dotsLength={feed?.posts.length}
        activeDotIndex={activeSlide}
        dotStyle={styles.dotStyle}
        animatedDuration={160}
        containerStyle={styles.pagination}
        dotContainerStyle={styles.pagination}
        inactiveDotOpacity={0.5}
        inactiveDotScale={0.6}
        carouselRef={carouselRef}
        tappableDots
        dotColor={colors.primary}
        inactiveDotColor={colors.medium}
      /> */}
      <AppCarousel
        data={feed.posts}
        imager={{ feed, showMediaFunc, handleLike, liked }}
        activeSetter={activeSetter}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  dotStyle: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  pagination: {
    width: 10,
  },
});
export default CarouselDisplay;
