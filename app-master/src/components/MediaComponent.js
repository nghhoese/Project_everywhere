import React, {useEffect} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import Sound from 'react-native-sound';
import Video from 'react-native-video';
import {API_URL} from '../config/config';

const AudioComponent = ({media}) => {
  useEffect(() => {
    const whoosh = new Sound(
      `${API_URL}/${media}`,
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }

        whoosh.play();
      },
    );

    return () => {
      whoosh.stop(() => {
        whoosh.release();
      });
    };
  }, [media]);
  return <></>;
};

const VideoComponent = ({media}) => {
  return (
    <View style={styles.video_container}>
      <Video
        source={{uri: `${API_URL}/${media}`}}
        style={styles.video}
        resizeMode="contain"
        onError={console.log}
      />
    </View>
  );
};

const ImageComponent = ({media}) => {
  return (
    <Image
      style={styles.image}
      source={{
        uri: `${API_URL}/${media}`,
      }}
    />
  );
};

const MediaComponent = ({media, media_type}) => {
  if (media_type === 'image') {
    return <ImageComponent media={media} />;
  } else if (media_type === 'audio') {
    return <AudioComponent media={media} />;
  } else if (media_type === 'video') {
    return <VideoComponent media={media} />;
  } else if (media_type === 'none') {
    return <></>;
  }

  console.log(`Don't know mediatype ${media_type}`);
  return <></>;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  video_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    margin: 10,
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
});

export default MediaComponent;
