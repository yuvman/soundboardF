import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4a90e2', 
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 40,
        paddingBottom: 40,
    },
    flexRow: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'center',
        marginBottom: 20, //extra spacing
    },
    heading: {
        fontSize: 48, 
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', //white for contrast
    },
    instrumentButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20, 
    },

    recordingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '90%', 
        marginBottom: 20,
    },

    button: {
        backgroundColor: '#FFA726', // Orange
        padding: 20, 
        marginHorizontal: 10, 
        borderRadius: 20, 
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF', 
        fontWeight: '500',
    },
});
