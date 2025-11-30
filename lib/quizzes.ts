export interface Quiz {
  id: string;
  articleId: string;
  title: string;
  difficulty: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export const quizzes: Quiz[] = [
  {
    id: "esp32_intro_quiz",
    articleId: "esp32_intro",
    title: "ESP32 Essentials Quiz",
    difficulty: 2,
    questions: [
      {
        id: "esp32_intro_q1",
        question: "Which built-in feature makes the ESP32 good for wireless projects?",
        options: ["A built-in speaker", "Wi-Fi and Bluetooth radios", "A large LCD screen", "A high-voltage motor port"],
        answer: 1,
        explanation:
          "The ESP32 includes Wi-Fi and Bluetooth radios on the chip, letting it connect to networks or nearby devices without extra modules.",
      },
      {
        id: "esp32_intro_q2",
        question: "Why should you upload the Blink example when first setting up an ESP32?",
        options: [
          "It installs new drivers automatically",
          "It proves the board, cable, and IDE settings are working",
          "It connects the board to Wi-Fi",
          "It stores your password on the chip",
        ],
        answer: 1,
        explanation:
          "Blink is a simple program that flashes the on-board LED. If it uploads and blinks, the computer, cable, and toolchain are configured correctly.",
      },
      {
        id: "esp32_intro_q3",
        question: "What makes the ESP32 different from an Arduino Uno?",
        options: [
          "It cannot use digital pins",
          "It always needs an external Wi-Fi shield",
          "It has a faster processor and built-in wireless radios",
          "It cannot be programmed in the Arduino IDE",
        ],
        answer: 2,
        explanation:
          "Compared to the Uno, the ESP32 offers more processing power and includes Wi-Fi/Bluetooth radios, while still being programmable with Arduino tools.",
      },
      {
        id: "esp32_intro_q4",
        question: "Which programming languages are commonly used on the ESP32 for students?",
        options: ["Java and Kotlin", "Arduino C++ and MicroPython", "Swift only", "Binary machine code only"],
        answer: 1,
        explanation:
          "Classrooms often use Arduino-style C++ sketches or MicroPython scripts because both have strong community support and learning resources.",
      },
    ],
  },
  {
    id: "motors_basics_quiz",
    articleId: "motors_basics",
    title: "Motor Types Check",
    difficulty: 2,
    questions: [
      {
        id: "motors_basics_q1",
        question: "Which motor is best for turning wheels at variable speed?",
        options: ["DC motor with PWM control", "Stepper motor without a driver", "Analog clock motor", "Fan-only motor"],
        answer: 0,
        explanation:
          "DC motors respond smoothly to PWM signals and H-bridge drivers, making them ideal for wheels that need continuous speed changes.",
      },
      {
        id: "motors_basics_q2",
        question: "How does a servo motor receive its position command?",
        options: ["By changing supply voltage", "By timed control pulses", "By rotating a knob", "By Bluetooth packets only"],
        answer: 1,
        explanation:
          "Hobby servos interpret pulse widths (usually 1–2 ms) sent every 20 ms. The pulse width tells the servo which angle to hold.",
      },
      {
        id: "motors_basics_q3",
        question: "What is a common advantage of a stepper motor?",
        options: ["It never needs power", "It moves in precise steps", "It includes built-in Wi-Fi", "It cools itself automatically"],
        answer: 1,
        explanation: "Steppers move in defined increments, so they are used when exact positioning is required, like in plotters and 3D printers.",
      },
      {
        id: "motors_basics_q4",
        question: "Why is an H-bridge driver used with DC motors?",
        options: ["To make lights brighter", "To reverse motor direction safely", "To store data", "To connect to HDMI"],
        answer: 1,
        explanation:
          "An H-bridge driver switches motor polarity electronically, allowing the motor to spin forward or backward while protecting the microcontroller pins.",
      },
      {
        id: "motors_basics_q5",
        question: "What should you check before wiring any motor?",
        options: [
          "If it has built-in Wi-Fi",
          "Its voltage and current ratings compared to your driver and battery",
          "Whether it glows in the dark",
          "If it can store code",
        ],
        answer: 1,
        explanation:
          "Matching voltage and current ratings prevents overheating, brownouts, and damage to both the driver and the motor.",
      },
    ],
  },
  {
    id: "sensors_basics_quiz",
    articleId: "sensors_basics",
    title: "Sensor Fundamentals Quiz",
    difficulty: 2,
    questions: [
      {
        id: "sensors_basics_q1",
        question: "What does an ultrasonic sensor measure?",
        options: ["Light intensity", "Sound volume", "Distance using sound echoes", "Magnetic field"],
        answer: 2,
        explanation:
          "Ultrasonic sensors emit a sound pulse and time its echo, allowing the microcontroller to calculate distance to nearby objects.",
      },
      {
        id: "sensors_basics_q2",
        question: "Why should sensors be calibrated?",
        options: ["To make them waterproof", "To adjust readings for the real environment", "To increase Wi-Fi range", "To change the color of wires"],
        answer: 1,
        explanation:
          "Calibration records baseline values and adjusts thresholds so the robot responds correctly to the actual lighting, distance, or tilt conditions.",
      },
      {
        id: "sensors_basics_q3",
        question: "Which connection type is typical for a simple pushbutton?",
        options: ["I2C bus", "Analog voltage divider", "Digital input pin with pull-up or pull-down", "SPI bus"],
        answer: 2,
        explanation:
          "Buttons are usually read as digital inputs. Pull-up or pull-down resistors provide a stable HIGH or LOW when the button is not pressed.",
      },
      {
        id: "sensors_basics_q4",
        question: "How can you reduce noisy sensor readings in code?",
        options: ["Ignore them", "Use a moving average filter", "Increase motor speed", "Remove the ground wire"],
        answer: 1,
        explanation:
          "A moving average filter smooths out spikes by averaging recent readings, helping the robot react steadily.",
      },
    ],
  },
  {
    id: "line_follower_quiz",
    articleId: "line_follower_theory",
    title: "Line Follower Logic Quiz",
    difficulty: 3,
    questions: [
      {
        id: "line_follower_q1",
        question: "Why are two or more infrared sensors placed at the front of a line follower?",
        options: ["For decoration", "To compare left and right readings for steering", "To boost Wi-Fi", "To measure battery voltage"],
        answer: 1,
        explanation:
          "Comparing multiple sensors shows whether the robot is left or right of the line so it can steer back to the center.",
      },
      {
        id: "line_follower_q2",
        question: "What happens when both line sensors read the same value during a race?",
        options: ["The robot stops forever", "The robot should keep a slight forward speed", "The robot must reverse", "The robot changes lanes"],
        answer: 1,
        explanation:
          "When sensors match, the robot is usually centered or momentarily unsure. Maintaining a gentle forward speed keeps it moving until a difference appears again.",
      },
      {
        id: "line_follower_q3",
        question: "Why is PWM used to drive the motors in a line follower?",
        options: ["To turn Wi-Fi off", "To change LED colors", "To adjust motor speed smoothly for turns", "To store sensor data"],
        answer: 2,
        explanation:
          "PWM lets the controller vary motor power smoothly, enabling gentle course corrections instead of jerky movements.",
      },
      {
        id: "line_follower_q4",
        question: "What is the main purpose of calibrating line sensors before racing?",
        options: ["To change the paint color of the track", "To set threshold values that match the track's contrast", "To heat up the motors", "To shrink the robot"],
        answer: 1,
        explanation:
          "Calibration captures sensor readings on and off the line so code can set thresholds that work for that specific track and lighting.",
      },
      {
        id: "line_follower_q5",
        question: "Which safety check should be done before increasing the robot's speed?",
        options: [
          "Remove all screws",
          "Confirm wiring is secure and the driver stays cool",
          "Disconnect the ground wire",
          "Cover the sensors",
        ],
        answer: 1,
        explanation:
          "Stable wiring and cool drivers prevent brownouts or damage when the motors draw more current at higher speeds.",
      },
    ],
  },
];
