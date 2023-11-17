import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  //function handle Registration button
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    axios.post('http://localhost:8000/register',user).then((response) =>{
      console.log(response.data);
      Alert.alert("Registration successful","You have successfully registered");
      setName("");
      setEmail("");
      setPassword("");
      setImage("");
    }).catch((error) => {
      Alert.alert("Registration failed","Error: " + error.message);
      console.log("error:", error)
    })
  };

  return (
    <SafeAreaView
      style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}
    >
      <View>
        <Image
          style={{ height: 100, width: 150, resizeMode: "contain" }}
          source={{
            uri: "https://www.edigitalagency.com.au/wp-content/uploads/Linkedin-logo-png.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 10,
              color: "#041E42",
            }}
          >
            Log in to your account
          </Text>
        </View>
        <View style={{ marginTop: 60 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              borderRadius: 5,
              marginTop: 30,
              paddingVertical: 5,
            }}
          >
            <AntDesign
              name="mail"
              size={24}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 18 : 18,
              }}
              placeholder="Enter your email"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              borderRadius: 5,
              marginTop: 30,
              paddingVertical: 5,
            }}
          >
            <AntDesign
              name="user"
              size={24}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              autoCapitalize="none"
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 18 : 18,
              }}
              placeholder="Enter your username"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              borderRadius: 5,
              marginTop: 30,
              paddingVertical: 5,
            }}
          >
            <AntDesign
              name="lock"
              size={24}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 18 : 18,
              }}
              placeholder="Enter your password"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              borderRadius: 5,
              marginTop: 30,
              paddingVertical: 5,
            }}
          >
            <FontAwesome
              name="image"
              size={24}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              autoCapitalize="none"
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: image ? 18 : 18,
              }}
              placeholder="Enter your image url"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <Text>Keep me in logged in</Text>
            <Text style={{ color: "#007FFF", fontWeight: 500 }}>
              Forgot your password
            </Text>
          </View>
          <View style={{ marginTop: 80 }}></View>
          <Pressable
            onPress={handleRegister}
            style={{
              backgroundColor: "#0072b1",
              width: 200,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
