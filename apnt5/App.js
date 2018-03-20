import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AppRegistry, Button } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StackNavigator } from 'react-navigation';

async function getData() {
  const data = await fetch('https://devccc.assuredperformance.net/react_test.php')
  return await data.json()
}

const filterFeed = (array) => {
  return array.filter(element => element[0] === "drawpage")
}

const matchPage = (array1, array2) => {
  return array1.map(page => {
    page.elements = array2.filter(element => element[1] === page[1] && element[0] === "fillpage")
    return page
  })
}

const feed = []

class ScreenOne extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      pageIndex: []  
    };
  } 

  static navigationOptions = {
    title: 'Homepage'
  }

  componentWillMount() {
    getData()
      .then(data => data.map(element => feed.push(element)))
      .then(res => filterFeed(feed))
      .then(res => matchPage(res, feed))
      .then(res => this.setState({ pageIndex: res }))
      // .then(() => console.log(this.state.pageIndex))
      .then(res => this.setState({ ready: true }))
      .catch(err => alert("An error occurred"));
  }
  
  render() {
    const { navigate } = this.props.navigation
    if (!this.state.ready) {
      return(<Text>Loading...</Text>)
    } else {
      return (
        <Grid>
          <Row>
            <View style={styles.container}>
              <TouchableHighlight style={[styles.button, {backgroundColor: '#FECB44'}]}>
                <Text style={styles.buttonText}>{this.state.pageIndex[0].elements[0][3]}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.container}>
              <TouchableHighlight style={[styles.button, {backgroundColor: '#18A25F'}]}>
                <Text style={styles.buttonText}>{this.state.pageIndex[0].elements[1][3]}</Text>
              </TouchableHighlight>
            </View>
          </Row>
          <Row>
            <View style={styles.container}>
              <TouchableHighlight
                onPress={() => navigate("ScreenTwo", {screen: "Screen Two", pageIndex: this.state.pageIndex})}
                style={[styles.button, {backgroundColor: '#F9453B'}]}
              >
                <Text style={styles.buttonText}>{this.state.pageIndex[0].elements[2][3]}</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.container}>
              <TouchableHighlight style={[styles.button, {backgroundColor: '#4B8BF5'}]}>
                <Text style={styles.buttonText}>{this.state.pageIndex[0].elements[3][3]}</Text>
              </TouchableHighlight>
            </View>
          </Row>
        </Grid>
      );
    }
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
            <Text style={styles.buttonText}>{state.params.pageIndex[1].elements[0][3]}</Text>
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
  // tabBarOptions: { 
  //   activeTintColor: '#7567B1',
  //   labelStyle: {
  //     fontSize: 20,
  //     fontWeight: '600'
  //   }
  // }
});
  
export default SimpleApp 

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight:5,
  },
  button: {
    borderRadius: 10,
    padding: 25,
    paddingTop: 60,
    paddingBottom: 60
    
  },
  buttonText: {
    fontSize: 18,
    color: '#FAFAFA',
    textAlign: 'center',
    alignSelf:'center',
  }
});