

import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, NetInfo, AsyncStorage } from 'react-native';
import NavigationBar from 'react-native-navbar';

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

export default class App extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      ready: false,
      page: null,
      stored: false,
      pageIndex: []
    };
  }

  componentWillMount() {
    NetInfo.getConnectionInfo()
      .then(connectionInfo => {
        const connectStatus = connectionInfo.type !== "none"
        this.setState({ isConnected : connectStatus})
        // console.log(this.state.isConnected)
      })
      // .then(() => console.log('Are we on:' + this.state.isConnected))
      .then(() => NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange))
      .then(() => AsyncStorage.getItem('stored'))
      .then(value => { if (value) {
        this.setState({stored: value})} else {this.setState({stored: false})}
      })
      .then(() => {
        if (this.state.isConnected) {
          getData()
            .then(data => data.map(element => feed.push(element)))
            .then(res => filterFeed(feed))
            .then(res => matchPage(res, feed))
            .then(res => this.setState({ pageIndex: res }))
            .then(() => AsyncStorage.setItem('pageIndex', JSON.stringify(this.state.pageIndex)))
            .then(() => AsyncStorage.setItem('stored', 'true'))
            .then(() => this.setState({ stored: true}))
            .then(() => this.setState({ page: parseInt(this.state.pageIndex[0][1].match(/\d+/g)-1, 10) }))
            .then(() => this.setState({ ready: true }))
        } else if (this.state.stored && !this.state.isConnected) {
          AsyncStorage.getItem('pageIndex')
            .then(req => JSON.parse(req))
            .then(json => this.setState({ pageIndex: json}))
            .then(() => this.setState({ page: parseInt(this.state.pageIndex[0][1].match(/\d+/g)-1, 10) }))
            .then(() => thi.setState({ready:true}))
            .catch(error => console.log('error!'))
        } else {
          alert('connect to the internet')
        }})
      .catch(err => alert("An error occurred"))
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({isConnected: isConnected });
    } else {
      this.setState({isConnected: isConnected });
    }
  };

  fillPage = (element) => {
    let item = element[2]
    switch (item) {
      case 'button':
        return <TouchableHighlight key={element[3]} onPress={() => {element[4] === "disabled" ? console.log('your going nowhere') : this.setState({ page: parseInt(element[5].match(/\d+/g)-1, 10) })}} style={{backgroundColor: '#8E84FB', padding: 20, borderRadius: 10, margin: 10}}><Text style={{fontSize: 18, color: '#FAFAFA',textAlign: 'center',}}>{element[3]}</Text></TouchableHighlight>;
      case 'echo' :
        return <Text key={element[3]} style={{fontSize:20, textAlign:'center', marginTop: 40}}>{element[3]}!</Text>;
      default:
        return <Text>{element[3]}</Text>;
    }
  }

  rightButtonConfig = {
    title: 'Next',
    tintColor: '#FEFFFE',
    handler: () => {
      if (this.state.page == this.state.pageIndex.length-1) {
        return
      } else {
        this.setState({ page: this.state.page+1 })
      }
    },
  };
  
  leftButtonConfig = {
    title: 'Previous',
    tintColor: '#FEFFFE',
    handler: () => {
      if (this.state.page === 0) {
        return
      } else {
      this.setState({ page: this.state.page-1 })
      }
    },
  };
  
  titleConfig = {
    title: 'TEST APP',
    style: {color: "#F4F4F4",fontSize: 25},
  };
  
  render() {
    if (!this.state.ready) {
      return(<Text>Loading...</Text>)
    } else {
      return (
        <View style={styles.container}>
          <NavigationBar
           style={styles.navbar}
           tintColor="#E42A21"
           title={this.titleConfig}
           leftButton={this.leftButtonConfig}
           rightButton={this.rightButtonConfig}
          />
          {this.state.pageIndex[this.state.page].elements.map(item => this.fillPage(item))}
        </View>
      )
    }
  }
}

const styles = {
  container: {
    flex: 1,
  },
  navbar: {
    marginTop: 25,
    marginBottom: 25,
  },
};