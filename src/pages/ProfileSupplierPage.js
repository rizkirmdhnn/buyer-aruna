import React, { Component } from 'react';
import { Text, View, Image, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { Container, CardSection, ContainerSection, Card } from '../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class ProfileSupplierPage extends Component {

  static navigationOptions = {
    title: 'Profil Nelayan',
    headerRight: <View />
  }

  constructor(props) {
    super(props)

    this.state = {
      refreshing: true,
      dataParsing: '',
      dataProfile: '',
      tokenUser: '',
      idSupplier: ''
    }
  }

  componentWillMount() {
    this.setState({
      dataParsing: this.props.navigation.state.params.datas,
      idSupplier: this.props.navigation.state.params.datas.item.id
    }, () => {
      return this.getData();
    });
  }

  onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      this.getData();
    });
  }

  getData() {
    const { idSupplier } = this.state;
    axios.get(`${BASE_URL}/profile/${idSupplier}`)
      .then(response => {
        console.log(response, 'Response');
        res = response.data.user;
        console.log(res, 'Profile')
        this.setState({ dataProfile: res, refreshing: false })
      })
      .catch(error => {
        this.setState({ refreshing: false })
        console.log(error.response, 'Error');
        if (error.response) {
          alert(error.response.data.message)
        }
        else {
          alert('Koneksi internet bermasalah')
        }
      })
  }

  render() {
    const {
      dataProfile,
      refreshing
    } = this.state

    return (
      <ScrollView
        style={{ marginBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            resizeMode='contain'
            source={{ uri: `${BASE_URL}/images/${dataProfile.photo}` }}
          />
        </View>

        <Container>
          <ContainerSection>
            <View>
              <Text>Nelayan Aruna</Text>
              <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'Muli-Bold' }}>{dataProfile.name}</Text>
              <Text>
                {dataProfile.organizationType}{' '} 
                {dataProfile.organization}
              </Text>
            </View>
          </ContainerSection>

          <View style={{ borderWidth: 1, borderColor: '#eaeaea', margin: 5 }} />

          <ContainerSection>
            <Text style={{ flex: 1 }}>Alamat</Text>
            <Text style={{ flex: 1 }}>{dataProfile.City === undefined ? 'Alamat Tidak Tersedia' : dataProfile.City.name}</Text>
          </ContainerSection>
          <ContainerSection>
            <Text style={{ flex: 1 }}>Poin</Text>
            <Text style={{ flex: 1, justifyContent: 'flex-start' }}>{numeral(parseInt(dataProfile.pointNow, 0)).format('0,0')}</Text>
          </ContainerSection>

          <View style={{ borderWidth: 1, borderColor: '#eaeaea', margin: 5 }} />

        </Container>

        <Text style={{ marginLeft: 25, paddingTop: 20, flex: 1, fontWeight: 'bold' }}> Komoditas Unggulan </Text>

        {
          dataProfile.Products && dataProfile.Products.map(item =>
            <Card key={item.id}>
              <CardSection>
                <Image
                  style={{ width: 100, height: 100, margin: 10 }}
                  resizeMode='contain'
                  source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                />
                <View style={{ flex: 1, flexDirection: 'column', margin: 10 }}>
                  <Text style={{ color: COLOR.secondary_a, fontSize: 18 }}>{item.Fish && item.Fish.name}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                    <Text>Kapasitas :</Text>
                    <Text style={{ textAlign: 'right', marginLeft: '20%', fontWeight: 'bold', fontSize: 16 }}>{numeral(parseInt(item.capacity, 0)).format('0,0')} {item.Fish.unit}</Text>
                  </View>
                </View>
              </CardSection>
            </Card>
          )
        }
      </ScrollView>
    );
  }
}

const styles = {
  itemContainerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
  profileImageContainer: {
    height: 150,
    width: 150,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  profileImage: {
    height: 180,
    width: null,
    // margin: 10
    // borderRadius: 150,
  },
  itemContainerStyleSupplier: {
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  thumbnailStyles: {
    height: 100,
    width: 100,
    resizeMode: 'stretch',
  },
  headerTextStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
};
export default ProfileSupplierPage
