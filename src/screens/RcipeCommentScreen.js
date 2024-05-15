import React from 'react';
import { View,StyleSheet} from 'react-native';
import ViewComments from '../components/ViewComments';


const RcipeCommentScreen = ({ route }) => {

  return (
      <View style={styles.container}>
        <ViewComments route={route} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

});

export default RcipeCommentScreen;
