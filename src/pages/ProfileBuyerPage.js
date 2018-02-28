import React, { Component } from 'react'
import { View, Text, Image, AsyncStorage } from 'react-native'
import axios from 'axios'

import { BASE_URL, COLOR } from '../shared/lb.config';
import { Spinner, Button } from '../components/common'

class ProfileBuyerPage extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Profile',
		headerTitleStyle: { paddingLeft: '33%' },
	})

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			data: {},
			modalVisible: false,

			suggestions: [],
			value: '',
			FishId: '',

			screen: 'Profile'

		}
	}

	componentDidMount() {
		AsyncStorage.getItem('loginCredential', (err, result) => {
			if (result) {
				console.log(result, 'Token');
				axios.get(`${BASE_URL}/profile`, {
					headers: { token: result }
				})
					.then(response => {
						this.setState({ data: response.data.user })
						this.setState({ loading: false })
						console.log(response.data.user, 'Data Profile');
					})
					.catch(error => {
						if (error.response) {
							alert(error.response.data.message)
						}
						else {
							alert('Koneksi internet bermasalah')
						}
						this.setState({ loading: false })
					})
			}
		})
	}

	renderProfile = (data) => {
		return (
			<View style={styles.card}>
				<View style={styles.cardSection}>
					<Text style={{ color: COLOR.secondary_a }}>Data Pribadi</Text>
				</View>

				<View style={{ borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5 }} />

				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>Nama</Text>
					<Text style={styles.dataStyle}>{data.name}</Text>
				</View>

				<View style={styles.cardSection}>
					<Text style={styles.labelStyle}>Alamat</Text>
					<Text style={styles.dataStyle}>
						{`${data.subDistrict} \n${data.village} \n${data.City && data.City.name}`}
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

		const { data, loading } = this.state

		if (loading) {
			return (
				<View style={{ flex: 1 }}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={containerStyle}>
				<View style={headerHomeStyle}>
					<View style={profileImageContainer}>
						<Image
							style={profileImage}
							source={{ uri: `${BASE_URL}/images/${data.photo}` }}
						/>
					</View>
					<Text style={profileName}>{data.name}</Text>
					<Text style={profileName}>{data.organizationType} {data.organization} </Text>
				</View>
				<View style={menuContainerStyle}>
					{this.renderProfile(data)}
					<View style={{ height: 50, marginTop: 150 }}>
						<Button
							style={{ margin: 5, marginRight: 10 }}
							onPress={() => {
								console.log(this.props)
								this.props.navigation.navigate('ProfileBuyerEdit');
							}}
						>
							Ubah
						</Button>
					</View>
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
		width: '100%'
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
		marginTop: 10,
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
