import React, { useState }  from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import TextInput from '../components/TextInput'
import { ApiClient, DefaultHost } from '../helpers/api'
import { getConfig, setConfig } from '../helpers/creds'

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: "", error: "", success: ""}
  }

  async componentDidMount() {
    const config = await getConfig()
    const host = config.host || DefaultHost
    await this.onHostUpdated(host)
  }

  async onHostUpdated(host) {
    const config = await getConfig()
    config.host = host
    this.setState({value: host})
    try {
      const client = new ApiClient(host)
      await client.ping()
      setConfig(config)
      this.setState({success: "ping successful", error: ""})
    } catch(err) {
      this.setState({error: err.message, success: ""})
    }
  }

  loginPressed() {
    if (!!this.state.success) {
      this.props.navigation.navigate('LoginScreen')
    }
  }

  signupPressed() {
    if (!!this.state.success) {
      this.props.navigation.navigate('RegisterScreen')
    }
  }

  render() {
    return (
      <Background>
        <Logo />
        <Header>Nimble Interview Frontend</Header>
        <Paragraph>
          React Native Mobile App using Expo and Start Template for Design
        </Paragraph>
        <TextInput
          label="Backend Host"
          returnKeyType="next"
          value={this.state.value}
          onChangeText={this.onHostUpdated.bind(this)}
          error={!!this.state.error}
          errorText={this.state.error}
          successText={this.state.success}
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={this.loginPressed.bind(this)}
        >
          Login
        </Button>
        <Button
          mode="outlined"
          onPress={this.signupPressed.bind(this)}
        >
          Sign Up
        </Button>
      </Background>
    )
  }
}
