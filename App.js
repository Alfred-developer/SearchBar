import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, TextInput, ActivityIndicator, FlatList, View, Text, Image } from 'react-native';
import filter from 'lodash.filter';

const Api_URL = `https://randomuser.me/api/?results=30`

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchData(Api_URL);
  }, []);

  const fetchData = async(url) => {
    try{
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);

      console.log(json.results);
      setFullData(json.results)
      setIsLoading(false);
    }catch(error){
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  }

  const handlerSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      console.log(user);
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  }

  const contains = ({name, email}, query) => {
    const {first, last} = name;
    if(first.includes(query) || last.includes(query) || email.includes(query)){
      return true;
    }
    
    return false;
  }

  if( isLoading ){
    return(
      <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#5500dc"/>
      </View>
    )
  }

  if( error ){
    return(
      <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
        <Text>
          Error in fetch data... Please check your internet connect.
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}> 
      <TextInput  placeholder="Search" 
                  clearButtonMode="always" 
                  style={styles.searchbar} 
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={searchQuery}
                  onChangeText={(query) => handlerSearch(query)}
                  
                  />
      <FlatList 
        data={data}
        keyExtractor={(item) => item.login.username}
        renderItem={({item}) => (
          <View style={styles.itemContainer}> 
            <Image style={styles.image} source={{uri: item.picture.thumbnail}}/>
            <View>
              <Text style={styles.textName}>{ item.name.first } {item.name.last}</Text>
              <Text style={styles.textEmail}>{ item.email }</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingTop: 30,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  searchbar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    fontSize: 20,
    borderColor:'gray',
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600'
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: 'gray'
  }
});
