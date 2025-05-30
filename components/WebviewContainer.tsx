const WebView = require("react-native-webview").WebView;
import { StackActions, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 스택 파라미터 타입 정의
type RootStackParamList = {
  Details: {
    url?: string;
    isStack?: boolean;
  };
};

// 네비게이션 타입 정의
type WebViewNavigationProp = StackNavigationProp<RootStackParamList, "Details">;
type WebViewRouteProp = RouteProp<RootStackParamList, "Details">;

type Props = {
  navigation: WebViewNavigationProp;
  route: WebViewRouteProp;
};

export default function WebviewContainer({ navigation, route }: Props) {
  const targetUrl = "http://172.30.1.68:3000";
  const url = route.params?.url ?? targetUrl + "";

  const requestOnMessage = async (e: any): Promise<void> => {
    // 여기서 e.nativeEvent.data를 사용합니다
    try {
      const nativeEvent = JSON.parse(e.nativeEvent.data);
      if (nativeEvent?.type === "ROUTER_EVENT") {
        const path: string = nativeEvent.data;
        if (path === "back") {
          const popAction = StackActions.pop(1);
          navigation.dispatch(popAction);
        } else {
          const pushAction = StackActions.push("Details", {
            url: `${targetUrl}${path}`,
            isStack: true,
          });
          navigation.dispatch(pushAction);
        }
      }
    } catch (error) {
      console.error("메시지 파싱 에러:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "white" }}
          edges={["top", "bottom"]}
        >
          <WebView
            originWhitelist={["*"]}
            source={{ uri: url }}
            onMessage={requestOnMessage}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  webview: {
    flex: 1,
  },
});
