import React, { Component } from 'react';
import { Text, View, FlatList, Image, ScrollView } from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import { CheckBox } from 'react-native-elements';

class DetailRequestOrderPage extends Component {
    static navigationOptions = {
        title: 'Detail Permintaan',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataMaster: ''
        };
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data Order');
        this.setState({ dataMaster: this.props.navigation.state.params.datas })
    }

    renderData = (item) => {
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={require('./../assets/image/gurame.jpg')}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.name}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text>{item.dueDate}</Text>
                    </View>
                </View>
            </View>
        )
    }


    renderSupplier = (item) => {
        return item.map((data) => {
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{data.size} </Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{data.budget}</Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    checked={true}
                                    onPress={() => this.checkBox(data)}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            )
        })
    }

    checkBox = (props) => {
        const dataClick = props;
        console.log(dataClick, 'Data Checked');
        this.setState({ checked: !this.state.checked })
    }


    render(props) {
        const supplierData = [
            {
                id: 1,
                name: 'Koperasi Sana Sini',
                size: '500 kg',
                budget: 'Rp. 10.000.000 - 2.000.000'
            },
            {
                id: 1,
                name: 'Koperasi Aku Kamu',
                size: '300 kg',
                budget: 'Rp. 10.000.000 - 2.000.000'
            },
            {
                id: 1,
                name: 'Koperasi Dia',
                size: '100 kg',
                budget: 'Rp. 10.000.000 - 2.000.000'
            },
            {
                id: 1,
                name: 'Koperasi Mereka',
                size: '250 kg',
                budget: 'Rp. 10.000.000 - 2.000.000'
            }
        ]
        return (
            <View>
                <FlatList
                    data={[this.state.dataMaster]}
                    renderItem={({ item }) => this.renderData(item)}
                />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ justifyContent: 'flex-start' }}> Nelayan Dipilih </Text>
                    <Text style={{ justifyContent: 'flex-end' }}> Nelayan DiTolak (2) </Text>
                </View>

                <View style={styles.containerScroll}>
                    <ScrollView>
                        <FlatList
                            data={[supplierData]}
                            renderItem={({ item }) => this.renderSupplier(item)}
                        />
                    </ScrollView>
                </View>
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
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 8
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
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    itemContainerStyleSupplier: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 8
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
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    loadingStyle: {
        marginTop: 30
    },
    containerScroll: {
        padding: 5,
        height: 200,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 2
    }
}

export default DetailRequestOrderPage;
