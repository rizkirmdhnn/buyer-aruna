import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'
import { COLOR } from './../shared/lb.config';
import Auction from './AuctionPage';
import AuctionAll from './AuctionAll';

class AuctionList extends Component {
	static navigationOptions = {
		title: 'Daftar Lelang',
		headerRight: <View />
	}

	constructor(props) {
		super(props)

		this.state = {
			screen: 'AuctionAll'
		}
	}

	renderScreen = () => {
		if (this.state.screen === 'AuctionAll') {
			return <AuctionAll navi={this.props.navigation} />
		}

		return <Auction navi={this.props.navigation} />
	}

	render() {
		const { screen } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.menuContainerStyle}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'AuctionAll' })}>
								<View style={screen === 'AuctionAll' ? styles.tabContainerActive : styles.tabContainer}>
									<Text style={screen === 'AuctionAll' ? styles.tabTextActive : styles.tabText}>Semua Lelang</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Auction' })}>
								<View style={screen === 'Auction' ? styles.tabContainerActive : styles.tabContainer}>
									<Text style={screen === 'Auction' ? styles.tabTextActive : styles.tabText}>Lelang Saya</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
					{this.renderScreen()}
				</View>
			</View>
		)
	}
}

const styles = {
	menuContainerStyle: {
		flex: 4
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
}

export default AuctionList

