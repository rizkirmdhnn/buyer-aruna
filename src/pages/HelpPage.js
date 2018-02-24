import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'

class HelpPage extends Component {
	static navigationOptions = {
		title: 'Pusat Bantuan',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, marginTop: 50}}>
				<Container>
					<ContainerSection>
						<View style={{flex: 1, marginBottom: 30}}>
							<Image
								style={{alignSelf: 'center'}}
								source={require('./../assets/images/logo.png')} 
							/>
						</View>
					</ContainerSection>
					<View style={{justifyContent: 'center', alignItems: 'center'}}>
						<Text>Hubungi</Text>
						<Text>Pusat Bantuan</Text>
						<Text style={{fontSize: 20, marginTop: 10, marginBottom: 10}}>+62 21 777 8888</Text>
						<Text>atau</Text>
						<Text style={{fontSize: 20, marginTop: 10, marginBottom: 10}}>info@aruna.id</Text>
					</View>
				</Container>
			</View>
		)
	}
}

export default HelpPage
