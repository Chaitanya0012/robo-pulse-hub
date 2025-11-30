export interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  prerequisites: string[];
  difficulty: number;
  estimated_minutes: number;
}

export const articles: Article[] = [
  {
    id: "esp32_intro",
    title: "Getting to Know the ESP32",
    summary:
      "An introduction to the ESP32 microcontroller, its features, and why it is popular for robotics and IoT projects.",
    body:
      "The ESP32 is a tiny computer on a chip created by Espressif. It includes a fast dual-core processor, built-in Wi-Fi, and Bluetooth. This means it can connect to the internet or talk to sensors and other boards without extra parts. Many students pick the ESP32 because it is affordable, powerful, and supported by large communities. The chip can be programmed using the Arduino IDE or MicroPython, making it flexible for classrooms.\n\nIn robotics, the ESP32 can read inputs from sensors like line trackers or ultrasonic rangefinders, process that data, and control outputs such as motors or LEDs. The Wi-Fi radio allows you to send data to a phone or a cloud dashboard. Power management features let the board run on batteries efficiently. Understanding the ESP32’s strengths helps you choose the right board for each project.\n\nTo start, install the Arduino IDE, add the ESP32 board support package, and connect your board with a USB cable. Upload the Blink example to test your setup. Once you see the LED blink, you are ready to explore sensors, motors, and wireless communication.",
    tags: ["esp32", "introduction", "wifi", "bluetooth"],
    prerequisites: [],
    difficulty: 2,
    estimated_minutes: 15,
  },
  {
    id: "esp32_wifi_basics",
    title: "ESP32 Wi-Fi Basics",
    summary:
      "Learn how the ESP32 connects to Wi-Fi networks, sends simple messages, and keeps connections secure.",
    body:
      "The ESP32 includes a Wi-Fi radio that works like the one inside a laptop or phone. In station mode, the ESP32 joins an existing router so it can send or receive data from the internet. In access point mode, it creates its own network so devices can connect directly. Most classroom projects start in station mode.\n\nTo connect, you program the ESP32 with your network name (SSID) and password. The board uses the 2.4 GHz band, so make sure your router supports it. Once connected, the ESP32 can make HTTP requests, send data to a server, or expose a small web page for controlling a robot.\n\nSecurity matters, even in student projects. Use WPA2 networks, avoid sharing passwords in public code, and reset credentials before publishing projects online. You can also create simple status LEDs or serial prints that show whether the Wi-Fi connection succeeded. This feedback helps during troubleshooting.\n\nAfter learning Wi-Fi basics, you can build dashboards that display sensor readings, send commands to motors, or log data for science experiments.",
    tags: ["esp32", "wifi", "networking"],
    prerequisites: ["esp32_intro"],
    difficulty: 3,
    estimated_minutes: 20,
  },
  {
    id: "esp32_pwm_basics",
    title: "ESP32 PWM and Analog Output",
    summary:
      "Discover how to create smooth brightness and speed control using the ESP32's PWM outputs.",
    body:
      "Pulse Width Modulation (PWM) is a technique for creating an average voltage by rapidly turning a pin on and off. The ESP32 can produce high-frequency PWM signals on many pins, and the duty cycle controls how much time the signal stays ON within each cycle. A 0% duty cycle means the signal is always OFF; a 100% duty cycle means always ON. Values in between create adjustable power.\n\nPWM is essential for robotics. You dim LEDs without flicker, set motor speeds gently, or control servo positions with timing-based signals. The ESP32 uses flexible timers called LEDC channels to generate PWM. In the Arduino IDE, you set the channel number, frequency (often between 500 Hz and 5 kHz for DC motors), and resolution (commonly 8 to 12 bits).\n\nFor example, a 10-bit resolution offers 1024 duty cycle steps. Writing a duty value of 512 outputs roughly 50% power. Smooth changes prevent sudden jerks in motors, protecting gears and making robots easier to control. Always double-check that the chosen GPIO pins support PWM and that your power supply matches the motor’s needs.",
    tags: ["esp32", "pwm", "analog", "motors"],
    prerequisites: ["esp32_intro"],
    difficulty: 3,
    estimated_minutes: 25,
  },
  {
    id: "esp32_motor_control",
    title: "Controlling DC Motors with the ESP32",
    summary:
      "How to safely drive DC motors using motor drivers, PWM, and common wiring patterns on the ESP32.",
    body:
      "The ESP32 cannot power motors directly because its GPIO pins provide only small currents. Instead, we use motor driver chips or modules. Popular choices include the L298N, L293D, and modern MOSFET-based drivers. These modules take logic signals from the ESP32 to switch higher currents from a battery to the motor.\n\nA typical setup uses two control pins per motor: one for direction and one for PWM speed. Setting IN1 high and IN2 low might spin a motor forward; swapping them reverses direction. The PWM pin connects to the enable input of the driver to adjust speed smoothly. Always connect the driver’s ground to the ESP32 ground to share a reference.\n\nBack-emf protection diodes or built-in flyback circuits prevent voltage spikes when the motor stops. Use a separate power supply for motors if they draw more than a few hundred milliamps; brownouts can reset the ESP32. Add capacitors across motor terminals to reduce noise.\n\nTest your wiring with low duty cycles first, listen for smooth sound, and verify that the driver and motor stay cool. This method keeps your robot safe while you experiment with steering, arm joints, or conveyor belts.",
    tags: ["esp32", "motors", "drivers", "pwm"],
    prerequisites: ["esp32_intro", "esp32_pwm_basics", "motors_basics"],
    difficulty: 4,
    estimated_minutes: 30,
  },
  {
    id: "arduino_intro",
    title: "Starting with Arduino Boards",
    summary:
      "Understand the basics of Arduino Uno-style boards, digital pins, and simple programs.",
    body:
      "Arduino boards are beginner-friendly microcontrollers that run simple programs called sketches. The Arduino Uno uses an ATmega328P chip with digital pins for input and output. You write code in the Arduino IDE, press Upload, and the program runs immediately.\n\nDigital pins read HIGH or LOW. Inputs connect to buttons or sensors, while outputs drive LEDs or send signals to modules. The built-in LED on pin 13 is great for quick tests. The setup() function runs once at startup, and loop() repeats forever, checking sensors and updating outputs.\n\nArduino libraries provide easy functions for common tasks, such as reading temperature sensors or controlling servos. Always match your board type in the IDE so the compiler uses the right settings. For safety, avoid drawing too much current from a pin (stay under 20 mA) and double-check wiring before powering circuits.\n\nMastering digital I/O prepares you for more advanced topics like analog sensing, communication protocols, and motor control.",
    tags: ["arduino", "introduction"],
    prerequisites: [],
    difficulty: 2,
    estimated_minutes: 15,
  },
  {
    id: "motors_basics",
    title: "Motor Basics for Robotics",
    summary:
      "Learn the differences between DC, servo, and stepper motors and when to use each in a robot.",
    body:
      "Motors turn electrical energy into motion. In school robotics, three types are common: DC motors, servo motors, and stepper motors. DC motors spin freely when supplied with voltage; you control their speed with PWM and direction using an H-bridge driver. They are great for wheels or fans.\n\nServo motors use a built-in control circuit and gear train to hold a specific angle, usually between 0° and 180°. They receive timed pulses to set position, making them perfect for robot arms or steering. Standard hobby servos run on 5–6 V and need a stable power supply.\n\nStepper motors move in tiny steps and excel at precise positioning, such as moving a drawing platform or 3D printer head. They require dedicated drivers and can hold position without feedback. However, they draw more power and can miss steps if overloaded.\n\nChoosing the right motor depends on the task: DC for simple spinning tasks, servos for controlled angles, and steppers for accurate movement. Always consider torque requirements, voltage ratings, and driver compatibility before wiring.",
    tags: ["motors", "dc", "servo", "stepper"],
    prerequisites: [],
    difficulty: 2,
    estimated_minutes: 18,
  },
  {
    id: "sensors_basics",
    title: "Sensor Basics for Robotics",
    summary:
      "Explore how common sensors work and how robots use them to understand the environment.",
    body:
      "Sensors convert physical changes into electrical signals the microcontroller can read. Light-dependent resistors (LDRs) change resistance with brightness. Ultrasonic sensors measure distance by timing sound pulses. Infrared line sensors detect dark and light contrast on the ground. Accelerometers measure acceleration and tilt.\n\nRobots combine multiple sensors to make decisions. For example, a line follower uses two or more infrared sensors to keep wheels centered on a dark track. A distance sensor prevents collisions by slowing the motors when an obstacle is close. Analog sensors connect to analog input pins, producing a range of values. Digital sensors send HIGH or LOW signals or communicate through protocols like I2C or SPI.\n\nGood sensor placement matters. Keep ultrasonic sensors away from noisy motors, and mount line sensors close to the floor. Calibrate sensors by recording baseline values in normal conditions, then adjusting thresholds in code. Filtering noisy readings with moving averages helps the robot react smoothly. Understanding these basics makes debugging easier and keeps robots reliable.",
    tags: ["sensors", "ultrasonic", "infrared", "calibration"],
    prerequisites: ["arduino_intro"],
    difficulty: 2,
    estimated_minutes: 18,
  },
  {
    id: "line_follower_theory",
    title: "How Line Follower Robots Work",
    summary:
      "Learn the control logic, sensors, and tuning steps that keep a robot car on a track.",
    body:
      "A line follower robot uses infrared sensors to detect contrast between a dark line and a lighter floor. At least two sensors are placed near the front of the robot. When the left sensor sees dark and the right sensor sees light, the robot must steer left to recenter. The opposite pattern means steer right. If both see dark, the robot is centered; if both see light, it may have lost the track.\n\nMotor control is usually handled with PWM. Small duty cycle changes produce gentle turns, preventing the robot from zig-zagging. A simple algorithm maps sensor states to motor speeds. More advanced designs use proportional control: the greater the difference between sensor readings, the more the motor speeds differ.\n\nBefore racing, students calibrate sensors by recording values on the line and off the line. They adjust thresholds in code until the robot reacts quickly without jitter. Adding a slight forward bias keeps the robot moving even when both sensors momentarily see the same color.\n\nSafety and reliability come from neat wiring, secured batteries, and testing at low speeds before going faster. With practice, students can design courses with curves and intersections to challenge their code.",
    tags: ["line follower", "sensors", "motors", "pwm"],
    prerequisites: ["sensors_basics", "motors_basics"],
    difficulty: 3,
    estimated_minutes: 22,
  },
];
