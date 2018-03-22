import React, { Component } from 'react'
import { View, Text, Image, AsyncStorage, ScrollView, RefreshControl } from 'react-native'
import axios from 'axios'

import { BASE_URL, COLOR } from '../shared/lb.config';
import { Spinner, Button } from '../components/common'

class ProfileBuyerPage extends Component {
	static navigationOptions = () => ({
		title: 'Profil',
		headerRight: <View />
	})

	constructor(props) {
		super(props)

		this.state = {
			data: {},
			modalVisible: false,
			tokenUser: '',
			suggestions: [],
			value: '',
			FishId: '',
			refreshing: true,
			screen: 'Profile'

		}
	}

	componentDidMount() {
		AsyncStorage.getItem('loginCredential', (err, result) => {
			this.setState({ tokenUser: result });
			if (result) {
				return this.getData();
			}
		})
	}

	onRefresh() {
		this.setState({
			refreshing: true
		}, () => {
			this.getData();
		});
	}

	getData() {
		axios.get(`${BASE_URL}/profile`, {
			headers: { token: this.state.tokenUser }
		})
			.then(response => {
				this.setState({ data: response.data.user })
				this.setState({ refreshing: false })
				console.log(response.data.user, 'Data Profile');
			})
			.catch(error => {
				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}
				this.setState({ refreshing: false })
			})
	}

	renderProfile = (data) => {
		console.log(data)
		return (
			<View style={styles.card}>
				<View style={styles.cardSection}>
					<Text style={{ color: COLOR.secondary_a, fontSize: 20 }}>Data Pribadi</Text>
				</View>

				<View style={{ borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5 }} />

				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>Nama</Text>
					<Text style={styles.dataStyle}>{data.name}</Text>
				</View>

				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>Alamat</Text>
					<Text style={styles.dataStyle}>
						{data.address !== undefined ? data.address : ''}
						{`\n${data.City !== undefined ? data.City.name : ''}`}
					</Text>
				</View>
				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>No. Telp</Text>
					<Text style={styles.dataStyle}>{data.phone}</Text>
				</View>
				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>No. Identitas</Text>
					<Text style={styles.dataStyle}>{data.idNumber}</Text>
				</View>
				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>Email</Text>
					<Text style={styles.dataStyle}>{data.email}</Text>
				</View>
			</View>
		)
	}


	render() {
		const {
			containerStyle, headerHomeStyle, menuContainerStyle,
			profileImageContainer, profileImage, profileName,
		} = styles

		const { data } = this.state;
		console.log(data, 'Cuy');
		return (
			<View>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh.bind(this)}
						/>
					}
				>
					<View style={containerStyle}>
						<View style={headerHomeStyle}>
							<View style={profileImageContainer}>
								<Image
									style={profileImage}
									source={{ uri: `${BASE_URL}/images/${data.photo}` }}
								/>
							</View>
							<Text style={profileName}>{data.name}</Text>
							<Text style={{ textAlign: 'center', paddingTop: 2, marginBottom: 5, color: '#fff', fontSize: 13, fontFamily: 'Muli-Bold' }}>{data.organizationType} {data.organization} </Text>
						</View>
						<View style={menuContainerStyle}>
							{this.renderProfile(data)}
						</View>
					</View>
				</ScrollView >
				<View style={{ height: 50 }}>
					<Button
						style={{ margin: 5, marginLeft: 35, marginRight: 35 }}
						onPress={() => {
							console.log(this.props)
							this.props.navigation.navigate('ProfileBuyerEdit');
						}}
					>
						Ubah
					</Button>
				</View>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	headerHomeStyle: {
		paddingTop: 20,
		flex: 2,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: COLOR.secondary_a,
		width: '100%',
		height: 210
	},
	menuContainerStyle: {
		flex: 4,
	},
	profileImageContainer: {
		height: 90,
		width: 90,
		alignSelf: 'center',
	},
	profileImage: {
		height: 90,
		width: 90,
		borderRadius: 50,
	},
	profileName: {
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 5,
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Muli-Bold'
	},
	coin: {
		height: 24,
		width: 24,
		alignSelf: 'center'
	},
	point: {
		marginTop: 1,
		marginLeft: 5,
		fontSize: 15,
	},
	labelStyle: {
		fontWeight: 'bold',
		flex: 1
	},
	dataStyle: {
		flex: 1
	},
	tabContainer: {
		backgroundColor: COLOR.element_a3,
		height: 50,
		justifyContent: 'center'
	},
	tabContainerActive: {
		backgroundColor: COLOR.element_a4,
		height: 50,
		justifyContent: 'center'
	},
	tabText: {
		color: '#eaeaea',
		textAlign: 'center',
		fontSize: 18
	},
	tabTextActive: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 18
	},
	card: {
		elevation: 1,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 8,
		padding: 10,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#fff'
	},
	cardSection: {
		padding: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative'
	}
}

export default ProfileBuyerPage
