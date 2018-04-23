import React, { Component } from 'react'
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native'
import Config from 'react-native-config'

import { Container, Button, ContainerSection } from '../components/common'

class HelpPage extends Component {
	static navigationOptions = {
		title: 'Pusat Bantuan',
		headerRight: <View />
	}

	redirectDiskusiAdmin = () => {
		console.log('Chat Admin');
		this.props.navigation.navigate('MessageAdmin');
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: 50 }}>
				<Container>
					<View>
						<Image
							style={{ alignSelf: 'center' }}
							source={require('./../assets/images/logo.png')}
						/>
					</View>
					<Text style={{ marginBottom: 30, marginTop: 10, textAlign: 'center' }}>v{Config.VERSION_NAME} - build {Config.BUILD_TYPE}</Text>

					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Text>Hubungi</Text>
						<Text>Pusat Bantuan</Text>
						<TouchableOpacity
							onPress={() => Linking.openURL('tel:0217778888').catch(err => console.error('An error occurred', err))}
						>
							<View>
								<Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10 }}>
									+62 21 777 8888
								</Text>
							</View>
						</TouchableOpacity>

						<Text>atau</Text>
						<TouchableOpacity
							onPress={() => Linking.openURL('mailto:info@aruna.id').catch(err => console.error('An error occurred', err))}
						>
							<View>
								<Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10 }}>info@aruna.id</Text>
							</View>
						</TouchableOpacity>

					</View>

					<ContainerSection>
						<Button onPress={() => { this.redirectDiskusiAdmin() }}>
							Chat Admin
						</Button>
					</ContainerSection>
				</Container>
			</View>
		)
	}
}

export default HelpPage
