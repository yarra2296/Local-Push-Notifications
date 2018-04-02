import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, AppState, Platform, Dimensions, Button, TextInput } from 'react-native';
import PushController from './PushController';
import DatePicker from 'react-native-datepicker';
import PushNotification from 'react-native-push-notification';

let {width, height} = Dimensions.get('window')

export default class App extends Component {
    constructor(props) {
        super(props);

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.state = {
            seconds: 5,
            isNotification: false,
            snoozePeriod: 0,
            isStopNotification: false,
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        setTimeout( () => {
            this.setTimePassed();
        },1000);
        if (appState === 'background' || 'foreground') {
            let date = new Date(this.state.datetime);

            if (Platform.OS === 'ios') {
                date = date.toISOString();
            }

            if(this.state.isNotification) {
                if(!this.state.isStopNotification) {
                    PushNotification.localNotificationSchedule({
                        foreground: true,
                        message: "Example of Push Local Notification using ReactNative",
                        date,
                        repeatType: 'time',
                        repeatTime: this.state.snoozePeriod * 1000 * 60
                    });
                }
            }
            if(this.state.isStopNotification) {
                PushNotification.cancelAllLocalNotifications()
            }
        }
    }

    setTimePassed(){
        this.setState({
            isStopNotification: false,
        })
    }

    saveTime(value){
        this.setState({
            snoozePeriod: value
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.datePicker}>
                    <Text style={styles.header}>Please Enter the Date and Time at {'\n\t\t'} which Notification is Pushed</Text>
                    <View style={styles.content}>
                        <View style={styles.date}>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20, width: 50}}>Date</Text>
                    <DatePicker
                        style={{width: 305}}
                        date={this.state.datetime}
                        mode="datetime"
                        format="MM-DD-YYYY HH:mm:ss"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        minuteInterval={10}
                        onDateChange={(datetime) => {
                            this.setState({datetime: datetime});
                        }}
                    />
                        </View>
                    <View style={styles.input}>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>Please Enter the{'\n'}snooze time (mins) </Text>
                        <View style={{width: 170}}>
                        <TextInput
                            placeholder='Snooze Time'
                            placeholderTextColor='#afb6b6'
                            autoCapitalize='none'
                            onChangeText={(text) => this.saveTime(text)}
                            keyboardType='numeric'
                            style={{bottom: 5}}
                        />
                        </View>
                    </View>
                    <View style={styles.submit}>
                        <Button title="Start" onPress={()=>(this.setState({isNotification: true}),this.handleAppStateChange())}/>
                        <View style={{marginTop: 30}}>
                        {this.state.isNotification ?
                        <Button title="Stop" onPress={()=>(this.setState({isStopNotification: true, isNotification: false}),PushNotification.cancelAllLocalNotifications())}/> : null}
                        </View>
                    </View>
                    </View>
                <PushController/>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    content:{
        marginTop: width/3,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    header:{
        color: 'red',
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 30,
    },
    datePicker: {
        marginTop: 30,
        marginLeft: 30,
    },
    date:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    picker: {
        width: 100,
        marginLeft: width/2-30,
    },
    submit: {
        marginRight: 30,
        marginTop: 30,
    },
    input:{
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textinput:{
        width: 100,
        borderBottomWidth: 3,
        alignItems: 'center',
        left: 5,
    },
});
