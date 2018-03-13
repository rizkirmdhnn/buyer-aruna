import React, { Component } from 'react';
import { Text, View, AsyncStorage, Image, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { Spinner, Container, CardSection, ContainerSection, Card } from '../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class ProfileSupplierPage extends Component {

  static navigationOptions = {
    title: 'Profil Supplier',
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
      AsyncStorage.getItem('loginCredential', (err, result) => {
        if (result) {
          this.setState({ tokenUser: result }, () => {
            return this.getData();
          })
        }
      });
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
    const { tokenUser, idSupplier} = this.state;
    axios.get(`${BASE_URL}/profile/${idSupplier}`, {
      headers: { token: tokenUser }
    })
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
            source={{ uri: `${BASE_URL}/images/${dataProfile.photo}` }}
          />
        </View>

        <Container>
          <ContainerSection>
            <View>
              <Text>Supplier Aruna</Text>
              <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'Muli-Bold' }}>{dataProfile.name}</Text>
              <Text>
                {dataProfile.organizationType}
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
            <Text style={{ flex: 1 }}>Point</Text>
            <Text style={{ flex: 1, justifyContent: 'flex-start' }}>{dataProfile.pointNow}</Text>
          </ContainerSection>

          <View style={{ borderWidth: 1, borderColor: '#eaeaea', margin: 5 }} />

        </Container>

        <Text style={{ marginLeft: 25, paddingTop: 20, flex: 1, fontWeight: 'bold' }}> Komoditas Unggulan </Text>

        {
          dataProfile.Products && dataProfile.Products.map(item =>
            <Card key={item.id}>
              <CardSection>
                <Image
                  style={{ width: 130, height: 130, margin: 10 }}
                  source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                />
                <View style={{ flex: 1, flexDirection: 'column', margin: 10 }}>
                  <Text>{moment(item.updatedAt).format('DD MMM YYYY')}</Text>
                  <Text style={{ color: COLOR.secondary_a, fontSize: 20 }}>{item.Fish && item.Fish.name}</Text>
                  <Text>{item.Fish.internationalName}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20 }}>
                    <Text>Total Fishlog:</Text>
                    <Text style={{ textAlign: 'right', marginLeft: '40%', fontWeight: 'bold', fontSize: 20 }}>{numeral(parseInt(item.capacity, 0)).format('0,0')} {item.Fish.unit}</Text>
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
    alignSelf: 'center',
    marginTop: 20
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 150,
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
