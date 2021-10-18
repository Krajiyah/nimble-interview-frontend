import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { getConfig, getCreds, saveCreds } from '../helpers/creds'
import { ApiClient } from '../helpers/api'

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: {value: '', error: ''},
      password: {value: '', error: ''},
    }
  }

  async componentDidMount() {
    try {
      const config = await getConfig()
      const client = new ApiClient(config.host)
      const creds = await getCreds()
      const res = await client.login(creds.username, creds.password)
      await saveCreds(creds.username, creds.password, res.token)
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Messages' }],
      })
    } catch(err) {
      // console.warn(err)
    }
  }

  async onSignupPressed() {
    const usernameError = nameValidator(this.state.username.value)
    const passwordError = passwordValidator(this.state.password.value)
    if (usernameError || passwordError) {
      this.setState({username: {...this.state.username, error: usernameError}, password: {...this.state.password, error: passwordError}})
      return
    }

    try {
      const config = await getConfig()
      const client = new ApiClient(config.host)
      const res = await client.signup(this.state.username.value, this.state.password.value)
      await saveCreds(this.state.username.value, this.state.password.value, res.token)
      
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Messages' }],
      })
    } catch(err) {
      this.setState({password: {...this.state.password, error: err.message}})
    }
  }

  render() {
    return (
      <Background>
        <BackButton goBack={this.props.navigation.goBack} />
        <Logo />
        <Header>Create Account.</Header>
        <TextInput
          label="Username"
          returnKeyType="next"
          value={this.state.username.value}
          onChangeText={(text) => this.setState({ username: {value: text, error: '' }})}
          error={!!this.state.username.error}
          errorText={this.state.username.error}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={this.state.password.value}
          onChangeText={(text) => this.setState({ password: {value: text, error: '' }})}
          error={!!this.state.password.error}
          errorText={this.state.password.error}
          secureTextEntry
        />
        <Button mode="contained" onPress={this.onSignupPressed.bind(this)}>
          Signup
        </Button>
        <View style={styles.row}>
          <Text>Already Have Account? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.replace('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </Background>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
