import { Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get("window");

const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

export const data = [
  {
    _id: "1",
    title: "Welcome to Actify Careers",
    description: "Discover new job listings and find your next opportunity",

    image: (
      <Image
        source={require("../assets/images/icon.png")}
        // style={{ resizeMode: "contain", width: SCREEN_WIDTH - 100 }}
        style={{
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_HEIGHT * 0.3,
          // resizeMode: "contain",
        }}
      />
    ),
  },
  {
    _id: "2",
    title: "Stay Informed & Prepared",
    description:
      "Get interview tips, notifications on new workshops, and campaign updates",
    image: (
      <Image
        source={{
          uri: "https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg",
        }}
        style={{
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_HEIGHT * 0.3,
          resizeMode: "contain",
        }}
      />
    ),
  },
  {
    _id: "3",
    title: "Apply & Test with Ease",
    description:
      "Easily apply for jobs and take relevant tests to showcase your skills",
    image: (
      <Image
        source={{
          uri: "https://cdni.iconscout.com/illustration/premium/thumb/online-mcq-test-8297419-6629157.png?f=webp",
        }}
        style={{
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_HEIGHT * 0.3,
          resizeMode: "contain",
        }}
      />
    ),
  },
];

export const GitHubTopics = [
  "open-source",
  "machine-learning",
  "web-development",
  "mobile-development",
  "devops",
  "blockchain",
  "data-science",
  "game-development",
  "UI-UX-design",
  "react",
  "angular",
  "vuejs",
  "nodejs",
  "django",
  "flask",
  "spring-boot",
  "docker",
  "kubernetes",
];
