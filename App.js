
import {useState} from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable,ScrollView, ActivityIndicator, Alert, Keyboard } from "react-native";
import{MaterialIcons} from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

const StatusBarHeight = StatusBar.currentHeight
const KEY_GPT ='SUA CHAVE AQUI';

export default function App(){

  const[city, setCity] = useState("");
  const[day, setDay] = useState(1);
  const [loading, setLoading] = useState (false);
  const [travel, setTravel] = useState("");

  async function handleGenerate(){
    if(city === ""){
      Alert.alert("Atenção","Preencha a cidade destino")
      return;
    }

    setTravel("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = 'Crie um roteiro para um viagem de exatos ${day.toFixed(0)} dias na cidade de ${city}, busque por pontos turisticos, locais mais visitados com uma boa recomendação, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça em topicos com nome do local onde ir em cada dia.'

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Authorization: ` Bearer ${KEY_GPT} `
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages:[
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
    .then(response => response.json())
    .then((data) => {
      if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        console.log(data.choices[0].message.content);
        setTravel(data.choices[0].message.content);
      } else {
        console.log('Resposta inválida da API OpenAI');
      }
    })
    
   .catch((error) => {
  console.log('Erro na requisição:', error);
  Alert.alert('Erro', 'Ocorreu um problema ao processar a solicitação.');
})
    .finally(()=>{
      setLoading(false);
    })
  }

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark content" translucent={true} backgroundColor="#F1F1F1"/>
             <Text style={styles.heading}>Roteiro de viagem</Text>

             <View style={styles.form}>
                <Text style={styles.label}>Destino</Text>
                <TextInput
                placeholder="Teresina, PI"
                style={styles.imput}
                values={city}
                onChangeText={(text) => setCity(text)}
                /> 

                <Text>Tempo de Estadia: <Text style={styles.day}> {day.toFixed(0)} </Text>Dias</Text>
                <Slider
  minimumValue={1}
  maximumValue={30}
  minimumTrackTintColor="#009688"
  maximumTrackTintColor="#000000" 
  value={day}
  onValueChange={(value) => setDay (value)}

/>
             </View>
             <Pressable style={styles.button} onPress={handleGenerate}>
              <Text style={styles.buttonText}>Gerar Roteiro</Text>
              <MaterialIcons name="travel-explore" size={24} color={"#fff"}/>
              </Pressable>

              <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false}>
                {loading &&( <View style={styles.content}>
                  <Text style={styles.title}>Carregando roteiro...</Text>
                  <ActivityIndicator color="#000"  size ="large"/>
                </View>)}

               {travel &&(
                 <View style={styles.content}>
                 <Text style={styles.title}>Roteiro da viagem</Text>
                 <Text>{travel}</Text>
               </View>
               )}
              </ScrollView>
        </View>

    );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d3d3d3",
        alignItems:'center',
        paddingTop:20,

    },
    heading:{
      fontSize:32,
      fontWeight:'bold',
      paddingTop:Platform.OS == 'android' ? StatusBar: 34
    },
    form:{
      backgroundColor:'#fff',
      width:'90%',
      borderRadius: 8,
      padding: 16,
      marginTop:16,
      marginBottom:8,
    },
    label:{
      fontWeight:'bold',
      fontSize: 18,
      marginBottom: 8,
    },
    imput:{
      borderWidth:1,
      borderRadius: 4,
      borderColor:'#94a3b8',
      padding: 8, 
      fontSize: 16,
      marginBottom: 16,
    },
    day:{
      backgroundColor: '#f1f1f1',
    },
    button:{
      backgroundColor:'#ff5656',
      width: '90%',
      borderRadius: 8,
      flexDirection:'row',
      padding: 14,
      justifyContent:'center',
      alignItems:'center',
      gap:8,
    },
    buttonText:{
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
    content:{
      backgroundColor:'#fff',
    padding: 16,
    width:'100%',
    marginTop: 16,
    borderRadius: 8,
    },
    title:{
      fontSize: 18,
      fontWeight:'bold',
      textAlign: 'center',
      marginBottom: 14,
    },
    containerScroll:{
      width: '90%',
      marginTop: 8,
    },
});
