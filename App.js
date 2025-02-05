import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import useAbortedFetch from './hooks/useAbortedFetch';

const URL = 'https://rata.digitraffic.fi/api/v1/trains/latest/'

export default function App() {
  const [search, setSearch] = useState('')
  const urlRef = useRef()
  const {data,error,loading} = useAbortedFetch(urlRef.current)
  const [trainStyle, setTrainStyle] = useState('')

  const searchTrain = (text) => {
    setSearch(text)
    const address = URL + text
    urlRef.current = address
    console.log(address)
  }

  const trainInfo = () => {
    if (loading){
      return(<Text>Ladataan...</Text>)
    }


    try {
      return(
        (data !== null && data[0].trainNumber !== null) &&

        <View>
          <Text style={{paddingBottom: 8}}>Liikkeellä: {data[0].runningCurrently === true ? 'Kyllä' : 'Ei'}</Text>
          {
            data[0].runningCurrently === true 
            &&
            <ScrollView style={styles.trainContainer}>
              {
                data[0].timeTableRows.map((stop, index) =>(
                  <Text style={stop.type === "ARRIVAL" ? styles.trainArrives : styles.trainLeaves} key={index}>{stop.type === "ARRIVAL" ? 'Saapuu klo:' : 'Lähtee klo:'} {new Date(stop.scheduledTime).toLocaleTimeString("fi-FI")} Asema: {stop.stationShortCode}</Text>
                ))
              }
            </ScrollView>
          }
        </View>
        
        )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View>
      <View>
        <Text style={{paddingTop: 30, fontSize: 20}}>Junat</Text>
        <Text>Hae junaa sen numerolla. Esim IC68 on 68</Text>
        <Text>Huom! Näytetään vain oletettu saapumis- tai lähtöaika</Text>
        <TextInput
          style={styles.field}
          placeholder='Hae junaa...'
          value={search}
          onChangeText={text => searchTrain(text)}
        />
      </View>
      <View>
        {
          trainInfo()
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    padding: 8,
    borderColor: "#000000",
    borderWidth: 1,
  },
  trainArrives: {
    padding: 8,
    borderColor: "#000000",
    backgroundColor: '#a5ff87',
    borderWidth: 1,
  },
  trainLeaves: {
    padding: 8,
    borderColor: "#000000",
    backgroundColor: '#ff8b87',
    borderWidth: 1,
  },
  trainContainer: {
    width: "100%",
    maxHeight: 500,
  }
});
