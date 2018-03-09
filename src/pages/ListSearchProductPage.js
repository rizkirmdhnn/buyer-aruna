/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { BASE_URL } from './../shared/lb.config';
import { Spinner } from '../components/common'

class ListSearchProductPage extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Searching',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' },
        headerLeft:
            <TouchableOpacity
                onPress={() => { navigation.navigate('Home') }}
            >
                <Image
                    style={{ width: 20, height: 20, marginLeft: 30 }}
                    source={require('./../assets/image/arr.png')} 
                />
            </TouchableOpacity>
    });

    constructor(props) {
        super(props)
        this.state = {
            dataSearch: '',
            loading: true
        }
    }

    componentDidMount() {
        this.setState({
            dataSearch: this.props.navigation.state.params.datas,
            loading: false
        })
    }

    profile = (data) => {
        this.props.navigation.navigate('ProfileSupplier', { datas: data })
    }

    renderData = (item) => {
        return item.map((data) => {
            console.log(data, 'Data Map')
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.profile(data)}
                    key={data.id}
                >
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${data.User.photo}` }}
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{data.User.name}</Text>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontSize: 13 }}>500 Kg</Text>
                                <Text>Rp. 19.000 - Rp. 20.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        })
    }

    render() {
        const {
            loading
        } = this.state

        if (loading) {
            return <Spinner size="large" />
        }
        return (
            <View>
                <FlatList
                    data={[this.state.dataSearch]}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
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
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 8
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
};

export default ListSearchProductPage;
