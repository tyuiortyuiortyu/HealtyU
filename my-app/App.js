import { StyleSheet, SafeAreaView } from 'react-native';

export default function App(){
    return <SafeAreaView style={styles.container}></SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});