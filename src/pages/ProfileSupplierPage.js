import React, { Component } from 'react';
import { Text, View, AsyncStorage, Image, ScrollView } from 'react-native';
import axios from 'axios';

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
      loading: true,
      dataParsing: '',
      dataProfile: ''
    }
  }

  componentWillMount() {
    this.setState({ dataParsing: this.props.navigation.state.params.datas })
    const idSupplier = this.props.navigation.state.params.datas.item.id;
    AsyncStorage.getItem('loginCredential', (err, result) => {
      axios.get(`${BASE_URL}/profile/${idSupplier}`, {
        headers: { token: result }
      })
        .then(response => {
          res = response.data.user
          this.setState({ dataProfile: res, loading: false })
          console.log(res, 'Profile')
        })
        .catch(error => {
          console.log(error.response, 'Error');
          if (error.response) {
            alert(error.response.data.message)
          }
          else {
            alert('Koneksi internet bermasalah')
          }
        })
    });
  }

  render() {
    const {
      loading,
      dataProfile
    } = this.state

    if (loading) {
      return <Spinner size='large' />
    }

    return (
      <ScrollView style={{marginBottom: 20}}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: `${BASE_URL}/images/${this.state.dataProfile.photo}` }}
          />
        </View>

        <Container>
          <ContainerSection>
            <View>
              <Text>Supplier Aruna</Text>
              <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'Muli-Bold'}}>{this.state.dataProfile.name}</Text>
              <Text>
                {this.state.dataProfile.organizationType}
                {this.state.dataProfile.organization}
              </Text>
            </View>
          </ContainerSection>
          
          <View style={{borderWidth: 1, borderColor: '#eaeaea', margin: 5}} />

          <ContainerSection>
            <Text style={{ flex: 1 }}>Alamat</Text>
            <Text style={{ flex: 1}}>{this.state.dataProfile.address}</Text>
          </ContainerSection>
          <ContainerSection>
            <Text style={{ flex: 1 }}>Point</Text>
            <Text style={{ flex: 1, justifyContent: 'flex-start' }}>{this.state.dataProfile.pointNow}</Text>
          </ContainerSection>

          <View style={{borderWidth: 1, borderColor: '#eaeaea', margin: 5}} />

        </Container>

        <Text style={{ marginLeft: 25, paddingTop: 20, flex: 1, fontWeight: 'bold' }}> Komoditas Unggulan </Text>

        {
           dataProfile.Products && dataProfile.Products.map(item =>
            <Card key={item.id}>
              <CardSection>
                <Image
                  style={{width: 100, height: 100}}
                  source={{uri: `${BASE_URL}/images/${item.Fish.photo}`}} 
                />
                <Text style={{color: COLOR.secondary_a, fontSize: 20, marginLeft: 10}}>{item.Fish && item.Fish.name}</Text>
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
