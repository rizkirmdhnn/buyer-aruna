import React, { Component } from 'react';
import { Text, View, FlatList, Image, ScrollView } from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import { Button } from 'react-native-elements';

class DetailRequestOrderPage extends Component {
    static navigationOptions = {
        title: 'Detail Permintaan',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataMaster: '',
            loading: null
        };
    };

    componentWillMount() {
        this.setState({ loading: true });
        console.log(this.props.navigation.state.params.datas, 'Data Order');
        this.setState({ dataMaster: this.props.navigation.state.params.datas })
        this.setState({ loading: false });
    }

    renderData = (item) => {
        console.log(item, 'Item Detail Request');
        const dateFormat = moment(item.dueDate).format('DD/MM/YYYY');
        const timeFormat = moment(item.dueDate).format('h:mm:ss');
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={require('./../assets/image/gurame.jpg')}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                    <Text style={styles.headerTextStyle}>{item.size}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text>Rp. {item.minBudget} - Rp. {item.maxBudget}</Text>
                        <Text>Batas Waktu: {dateFormat} Pukul: {timeFormat}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderFlatListDetail = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataMaster]}
                        renderItem={({ item }) => this.renderData(item)}
                    />
                </View>
            );
        }
    }

    renderFlatListSupplier = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataMaster]}
                        renderItem={({ item }) => this.renderSupplier(item)}
                    />
                </View>
            );
        }
    }



    renderSupplier = (item) => {
        console.log(item.Requests, 'Render Supplier Detail')
        return item.Requests.map((data) => {
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.SupplierId}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>Rp. 100.000 - Rp. 500.000</Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    checked={true}
                                // onPress={() => this.checkBox(data)}
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

    renderButton() {
        return (
            <Button
                title="Akhiri Permintaan"
                buttonStyle={styles.buttonStyle}
                // onPress={this.onButtonPress.bind(this)}
            />
        );
    }


    render(props) {
        return (
            <View>
                {this.renderFlatListDetail()}

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ justifyContent: 'flex-start' }}> Nelayan Dipilih </Text>
                    <Text style={{ justifyContent: 'flex-end' }}> Nelayan DiTolak (2) </Text>
                </View>

                <View style={styles.containerScroll}>
                    <ScrollView>
                        {this.renderFlatListSupplier()}
                    </ScrollView>
                </View>

                <View>
                    {this.renderButton()}
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
    },
    buttonStyle: {
        backgroundColor: '#006AAF',
        width: 318,
        height: 50,
        margin: 5,
        borderRadius: 5
    },
}

export default DetailRequestOrderPage;
