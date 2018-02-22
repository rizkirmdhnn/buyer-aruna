import React, { Component } from 'react'
import {
  FlatList,
  View,
  Image,
  Text,
  TouchableNativeFeedback,
  AsyncStorage,
  ScrollView,
  Alert
} from 'react-native'
import {
  CardRegistration,
  CardSectionRegistration,
  InputRegistration,
  Button,
  ContainerSection,
  Container,
  Spinner
} from './../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';
import axios from 'axios';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import { Card } from 'react-native-elements';

class RequestFormOrderSecondPage extends Component {

  static navigationOptions = {
    title: 'Pilih Supplier',
    headerRight: <View />
  }

  constructor(props) {
    super(props);
    this.state = {
      datax: [{}],
      dataSupplier: [{}],
      loading: true,
      loader: null,
      checkedSelected: [],
      idSupplier: []
    };
  };

  componentWillMount() {
    console.log(this.props.navigation.state.params.datas, 'Data 1');
    this.setState({ datax: this.props.navigation.state.params.datas });
  }

  componentDidMount() {
    console.log(this.state.datax, 'Data 2');
    AsyncStorage.getItem('loginCredential', (err, result) => {

      const token = result;
      console.log(token);
      axios.post(`${BASE_URL}/generate-request`, {
        'FishId': this.state.datax.FishId,
        'ProvinceId': this.state.datax.provinsiId,
        'CityId': this.state.datax.cityId,
        'maxPrice': this.state.datax.maxBudget
      }, {
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          res = response.data.data;
          console.log(res, 'RES')
          const result = res;
          console.log(result, 'Result Supplier nya');
          this.setState({ dataSupplier: result, checkedSelected: result, loading: false })
        })
        .catch(error => {
          console.log(error.message, 'Error nya');
          alert('Koneksi internet bermasalah')
        })
    });
  }


  checkItem = data => {
    const { checkedSelected } = this.state;
    if (!checkedSelected.includes(data)) {
      this.setState({
          checkedSelected: [...checkedSelected, data]
      });
    } else {
      this.setState({
          checkedSelected: checkedSelected.filter(a => a !== data)
      });
    }
  };

  onSubmit = () => {

    AsyncStorage.getItem('loginCredential', (err, result) => {
      const token = result;
      const { navigate } = this.props.navigation;
      const dataRequest = new FormData();
      dataRequest.append('FishId', this.state.datax.FishId);
      dataRequest.append('maxBudget', this.state.datax.maxBudget);
      dataRequest.append('dueDate', this.state.datax.datePick);
      dataRequest.append('quantity', this.state.datax.quantity);
      dataRequest.append('size', this.state.datax.size);

      console.log(this.state.idSupplier, 'Submit Request');

      this.state.checkedSelected.map((item, index) => {
          console.log(item.id, ' ', index, 'MAPING');
          dataRequest.append('ProductIds[' + index + ']', item)
      })

      dataRequest.append('photo', {
        uri: this.state.datax.photo.uri,
        type: 'image/jpeg',
        name: 'formrequest'
      });

      console.log(this.state.datax, 'Data Request');
      console.log(dataRequest, 'Data Form Append');

      axios.post(`${BASE_URL}/buyer/requests`,
        dataRequest
        , {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': result
          }
        }).then(response => {
          res = response.data.data;
          console.log(response, 'RES');
          navigate('Request');
          this.setState({ loader: false });
        })
        .catch(error => {
          console.log(error.message, 'Error nya');
          console.log(error.response, 'Error nya');
          console.log(error, 'Error nya');
          alert(error.message)
          this.setState({ loader: false });
        })
    });
  }

  renderButton = () => {
    const { navigate } = this.props.navigation;
    if (this.state.loader) {
      return <Spinner size='large' />
    }
    return (
      <Button
        onPress={
          () => this.onSubmit()
        }
      >
        Next
      </Button>
    )
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    console.log(v);
  }

  renderItem = (item) => {
    console.log(item, 'Item Data Supplier');
    return item.map((data) => {
      console.log(data, 'ID Supplier');
      this.state.idSupplier.push(data.id);
      console.log(this.state.idSupplier, 'ID PUSH SUPPLIER')
      return (
        <View style={styles.card}>
          <View style={styles.itemContainerStyle}>
            <View style={styles.thumbnailContainerStyle}>
              <Image 
                style={styles.thumbnailStyle}
                source={{uri: `${BASE_URL}/images/${data.User.photo}`}} 
              />
            </View>
            <View style={styles.headerContentStyle}>
              <Text style={styles.hedaerTextStyle}>{data.User.name}</Text>
              <Text>{data.User.organizationType} {data.User.organization}</Text>
              <Text>{
                // data.quantity ? data.quantity : '0'
              }
              </Text>
              <Text>Rp {data.minBudget} - Rp {data.maxBudget} /Kg</Text>
            </View>
            <CheckBox
                center
                onPress={() => this.checkItem(data)}
                checked={this.state.checkedSelected.includes(data)}
            />
          </View>
        </View>
      )
    })
  }

  render() {

    if (this.state.loading) {
      return <Spinner size="large" />
    }

    return (
      <ScrollView>
        <FlatList
          data={[this.state.dataSupplier]}
          renderItem={({ item }) => this.renderItem(item)}
        />

        <ContainerSection>
          {this.renderButton()}
        </ContainerSection>
      </ScrollView>
    );
  }
};


const styles = {
  card: {
    borderWidth: 1, 
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  },
  itemContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  hedaerTextStyle: {
    fontSize: 20,
    color: COLOR.secondary_a
  }
}

export default RequestFormOrderSecondPage;