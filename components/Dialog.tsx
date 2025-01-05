import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { dark } from "@/constants/Colors";
  import NetInfo from "@react-native-community/netinfo";
  
  const { height, width, fontScale } = Dimensions.get("window");
  
  const Dialog = () => {
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (!state.isConnected) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
  
      // Clean up the subscription
      return () => unsubscribe();
    }, []);
  
    const handleRetry = async () => {
      try {
        const state = await NetInfo.fetch(); 
        if (state.isConnected) {
          setVisible(false); 
          console.log("Retry: Connected");
        } else {
          console.log("Retry: Still not connected");
        }
      } catch (error) {
        console.error("Error checking network connection:", error);
      }
    };
  
    return (
      <Modal collapsable={true} transparent={true} visible={visible}>
        <View style={styles.container}>
          <View style={[styles.internalView]}>
            <Text style={styles.text}>No internet connection!</Text>
            <Text style={styles.description}>
              It seems you're offline. Please check your internet connection and
              try again.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.retryButton}
              onPress={handleRetry} 
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  export default Dialog;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    internalView: {
      width: width * 0.8,
      height: height * 0.2,
      borderRadius: 40,
      backgroundColor: "#FFF",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "3%",
    },
    text: {
      fontSize: fontScale > 1.24 ? 16 : 18,
      textAlign: "center",
      fontWeight: "700",
    },
    description: {
      fontSize: fontScale > 1.24 ? 14 : 16,
      textAlign: "center",
    },
    retryButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      width: "60%",
      backgroundColor: dark.background,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
  });
  