import React from 'react'
import { ScrollView , StyleSheet} from 'react-native';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { getConfig, getCreds, saveCreds } from '../helpers/creds';
import { ApiClient } from '../helpers/api';
import { nameValidator } from '../helpers/nameValidator';

const pageSize = 4

export default class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {messages: [], addedIDs: new Set(), message: {value: '', error: ''}, interval: undefined, page: 1}
  }

  async componentDidMount() {
    const interval = setInterval(async() => { // TODO: can poll w/ websocket for better pub/sub behviors or leverage FCM/GCM
      try {
        const creds = await getCreds()
        const config = await getConfig()
        const client = new ApiClient(config.host)
       
        const messages = (await client.getMessages(creds.token, this.state.page, pageSize)).filter(message => {
          return !this.state.addedIDs.has(message.ID)
        })
        if (messages.length == 0) {
          this.setState({page: 1})
        } else {
          messages.forEach(message => this.state.addedIDs.add(message.ID))
          const allMessages = this.state.messages.concat(messages)
          this.setState({messages: allMessages})

        }
        this.setState({page: this.state.page+1})
      } catch(err) {
        // console.warn(err)
      }
    }, 1000)
    this.setState({interval})
  }

  componentWillUnmount() {
    if (this.state.interval != undefined) {
      clearInterval(this.state.interval)
      this.setState({interval: 0})
    }
  }

  async sendPressed() {
    const messageError = nameValidator(this.state.message.value)
    if (messageError) {
      this.setState({message: {...this.state.message, error: messageError}})
      return
    }

    try {
      const config = await getConfig()
      const creds = await getCreds()
      const client = new ApiClient(config.host)
      await client.sendMessage(creds.token, this.state.message.value)
      this.setState({message: {value: "", error: ""}})
    } catch(err) {
      this.setState({message: {...this.state.message, error: err.message }})
    }
  }

  logoutPressed() {
    saveCreds("", "", "")
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'StartScreen' }],
    })
  }

  onMessageChange(text) {
    this.setState({ message: {value: text, error: '' }})
  }

  render() {
    return (
      <Background>
        <Logo />
        <Header>Messages</Header>
        
        <ScrollView style={styles.messageView} ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView ? this.scrollView.scrollToEnd({animated: true}) : null}>
        {this.state.messages.map(message => (
          <Paragraph style={styles.message} key={message.ID}>
            {message.username}: "{message.data}"
          </Paragraph>
        ))}
        </ScrollView>

        <TextInput
          label="Message"
          returnKeyType="done"
          value={this.state.message.value}
          onChangeText={this.onMessageChange.bind(this)}
          error={!!this.state.message.error}
          errorText={this.state.message.error}
        />

        <Button
          mode="outlined"
          onPress={this.sendPressed.bind(this)}
        >
          Send
        </Button>
       
        <Button
          mode="outlined"
          onPress={this.logoutPressed.bind(this)}
        >
          Logout
        </Button>
      </Background>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    textAlign: "left",
    paddingLeft: 10,
    paddingTop: 5,
  },
  messageView: {
    paddingBottom: 50,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
})

