import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AppRegistry, Button } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StackNavigator } from 'react-navigation';

async function getData() {
  const data = await fetch('https://devccc.assuredperformance.net/react_test.php')
  return await data.json()
}

const feed = []
getData()
  .then(data => data.map(element => feed.push(element)))
  .then( () => console.log(feed))

class ScreenOne extends React.Component  {
  static navigationOptions = {
    title: 'Page 1'
  }
  render() {
    const { navigate } = this.props.navigation
    return (
      <Grid>
        <Row>
          <View style={styles.container}>
            <TouchableHighlight style={[styles.button, {backgroundColor: '#FECB44'}]}>
              <Text style={styles.buttonText}>1</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.container}>
            <TouchableHighlight style={[styles.button, {backgroundColor: '#18A25F'}]}>
              <Text style={styles.buttonText}>2</Text>
            </TouchableHighlight>
          </View>
        </Row>
        <Row>
          <View style={styles.container}>
            <TouchableHighlight
              onPress={() => navigate("ScreenTwo", {screen: "Screen Two"})}
              style={[styles.button, {backgroundColor: '#F9453B'}]}
            >
              <Text style={styles.buttonText}>3</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.container}>
            <TouchableHighlight style={[styles.button, {backgroundColor: '#4B8BF5'}]}>
              <Text style={styles.buttonText}>4</Text>
            </TouchableHighlight>
          </View>
        </Row>
      </Grid>
    );
  }
};
  
class ScreenTwo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${feed[1][1]}`,
    }
  };
  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* <Text style={styles.titleText}>{state.params.screen}</Text> */}

        <View style={[styles.buttonContainer,{marginTop: 10}]}>
          <TouchableHighlight
            onPress={() => this.props.navigation.goBack()}
            style={[styles.button, {backgroundColor: '#8E84FB'}, {padding: 20}]}>
            <Text style={styles.buttonText}>{`${feed[1][3]}`}</Text>
          </TouchableHighlight>

          {/* <TouchableHighlight
            onPress={() => navigate("ScreenThree", { screen: "Screen Three" })}
            style={[styles.button, {backgroundColor: '#8E84FB'}]}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableHighlight> */}
        </View>
      </View>
    );
  }
};
  
const SimpleApp = StackNavigator({
  ScreenOne: { screen: ScreenOne },
  ScreenTwo: { screen: ScreenTwo },
}, {
  tabBarOptions: { 
    activeTintColor: '#7567B1',
    labelStyle: {
      fontSize: 16,
      fontWeight: '600'
    }
  }
});
  
export default SimpleApp 

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight:20,
  },
  button: {
    borderRadius: 15,
    padding: 70
  },
  buttonText: {
    fontSize: 18,
    color: '#FAFAFA',
    textAlign: 'center',
    alignSelf:'center',
  }
});