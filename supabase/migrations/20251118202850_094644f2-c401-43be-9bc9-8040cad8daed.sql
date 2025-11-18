-- Insert 10 robotics theory articles as lessons
INSERT INTO lessons (title, category, content, difficulty, description, level, order_index) VALUES
('What is a Robot?', 'Robotics Fundamentals', 'Robots sense the world (sensors), make decisions (controller), and act (motors/actuators). Good robot design links sensing → thinking → acting and checks that each step works.', 'Easy', 'Introduction to robot components and how they work together', 1, 1),
('Sensors: How Robots Perceive', 'Robotics Fundamentals', 'Sensors convert physical things (light, distance, touch) into electrical signals. Reliable sensing needs good placement, calibration, and noise filtering.', 'Easy', 'Understanding different sensors and how robots gather information', 1, 2),
('Motors & Movement', 'Robotics Fundamentals', 'Motors convert electrical energy into motion. DC motors give continuous spin, servos give controlled angle, and steppers move in fixed steps. Mechanical things (gears, wheels) change speed/torque.', 'Easy', 'How robots move and the role of different motor types', 1, 3),
('Power & Batteries', 'Robotics Fundamentals', 'Batteries supply voltage and current. Voltage is pressure; current is flow. Capacity (mAh) determines runtime. Voltage sag under load reduces motor performance. Use proper regulation and safe wiring.', 'Easy', 'Power systems and battery management for robots', 1, 4),
('Programming Basics', 'Robotics Fundamentals', 'Programs tell robots what to do step by step. Important concepts: inputs (sensors), outputs (actuators), loops, conditionals, and timing. Testing small parts before full integration avoids big mistakes.', 'Easy', 'Core programming concepts for robot control', 1, 5),
('Mechanical Design & Gearing', 'Robotics Fundamentals', 'Mechanical choices (wheel size, gear ratios, frame stiffness) affect robot behavior. Gears trade speed for torque; center of mass affects stability.', 'Medium', 'Understanding mechanical design principles', 2, 6),
('Sensing & Control Logic', 'Robotics Fundamentals', 'Robots use simple control like on/off, proportional control, and more advanced PID for smooth behavior. Understanding response and adjustment is key.', 'Medium', 'Advanced control systems and feedback loops', 2, 7),
('Diagnostics & Debugging', 'Robotics Fundamentals', 'Good debugging isolates cause: test components independently, log values, measure voltages and currents, and use methodical elimination.', 'Medium', 'Systematic troubleshooting techniques', 2, 8),
('Safety & Best Practices', 'Robotics Fundamentals', 'Safe design: use fuses, proper wiring, emergency stops, and plan for fail-safe behavior. Protect people and hardware.', 'Medium', 'Safety protocols and best practices', 2, 9),
('Integration: Making it all work', 'Robotics Fundamentals', 'Bringing sensors, power, motors, and code together requires staged testing: bench test components → integrate subsystems → full system tests. Always measure, log, and iterate.', 'Hard', 'System integration and testing strategies', 3, 10);

-- Insert diagnostic quiz questions for Article 1
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 1: What is a Robot?', 'Component: Microcontroller. Scenario: You uploaded a simple program to make the robot blink an LED, but the LED doesn''t blink. The LED and wiring were working earlier on a breadboard. What''s the most likely reason?', 
'["The microcontroller did not receive the program (upload failed)", "The LED burned out instantly", "The robot lost Wi-Fi", "The battery is over 9000 mAh"]',
'The microcontroller did not receive the program (upload failed)',
'If wiring and LED were checked, a failed upload or wrong pin setup on the microcontroller is the most likely cause. Follow-up: How would you verify the upload succeeded? Answer: Open the serial monitor or check the IDE''s upload/log message and test a simple built-in LED pin (e.g., pin 13) to confirm program runs.',
'Easy'),

('Article 1: What is a Robot?', 'Component: Power Supply (Battery). Scenario: Same robot: program uploaded and LED code runs when USB is connected, but not when powered by the battery. What''s the most likely cause?',
'["The battery is empty or the battery connector is loose", "The microcontroller hates LEDs", "The LED requires Wi-Fi", "The moon phase"]',
'The battery is empty or the battery connector is loose',
'If it works on USB but not battery, the power source or connector is the problem. Follow-up: What measurement would confirm the battery problem? Answer: Use a multimeter to check battery voltage at the robot''s power input.',
'Easy'),

('Article 1: What is a Robot?', 'Component: Pin Configuration (pinMode/digitalWrite). Scenario: The program uploaded, battery is fine, but LED still not blinking because the LED is wired to a pin that the program doesn''t control. Likely reason?',
'["Pin declared as INPUT instead of OUTPUT", "The LED chooses not to blink today", "The resistor changed color", "The microcontroller became a sensor"]',
'Pin declared as INPUT instead of OUTPUT',
'If pinMode wasn''t set to OUTPUT, digitalWrite won''t drive the LED properly. Follow-up: How do you fix it in code? Answer: Add pinMode(pin, OUTPUT); in setup() and then call digitalWrite(pin, HIGH/LOW).',
'Easy'),

('Article 1: What is a Robot?', 'Component: Ground connection. Scenario: LED is on when the microcontroller is connected to a computer, but when the motor is added the LED flickers or doesn''t blink consistently. Most likely cause?',
'["Missing common ground between motor driver, microcontroller and battery", "The LED is allergic to motors", "The motor software needs an update", "The breadboard is too small"]',
'Missing common ground between motor driver, microcontroller and battery',
'Motors cause electrical noise; if grounds aren''t common the signals can''t reference correctly and behavior is unstable. Follow-up: How do you wire a common ground? Answer: Connect the negative terminal of battery, the microcontroller ground pin, and driver ground together.',
'Easy'),

('Article 1: What is a Robot?', 'Component: Reset/Boot mode. Scenario: Sometimes the LED blinks, sometimes the microcontroller resets on power up and fails to run the sketch. Likely cause?',
'["Brownout or reset due to insufficient startup voltage or noise", "The code is too complicated", "The LED causes resets", "The robot is shy"]',
'Brownout or reset due to insufficient startup voltage or noise',
'Power dips at startup (brownouts) cause MCU to reset; decoupling caps or stable supply fixes it. Follow-up: Name one hardware fix to prevent brownout resets. Answer: Add decoupling (electrolytic) capacitor near MCU power pins or use a regulator with sufficient current.',
'Easy');

-- Article 2 questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 2: Sensors', 'Component: Ultrasonic Distance Sensor. Scenario: The ultrasonic sensor measures distance fine indoors, but outdoors its readings jump and are inconsistent. Most likely reason?',
'["Temperature and wind change sound speed and cause echo interference", "The sensor prefers darkness", "The microcontroller is jealous", "The sun stopped cooperating"]',
'Temperature and wind change sound speed and cause echo interference',
'Ultrasonic relies on sound travel; outdoors reflections, wind, and temperature variations cause noisy echoes. Follow-up: What method reduces noisy ultrasonic readings? Answer: Take multiple samples and use median filtering; shield sensor from wind or use shorter sampling windows.',
'Easy'),

('Article 2: Sensors', 'Component: IR Reflectance Sensor (line following). Scenario: The IR sensor reads very differently when the robot is in bright sunlight vs fluorescent indoor light; it fails outdoors. Most likely cause?',
'["Ambient IR from sunlight saturates the sensor", "The robot is tired", "The sensor loves indoor lights only", "Wheels are too big"]',
'Ambient IR from sunlight saturates the sensor',
'Sunlight contains infrared and can saturate reflectance sensors; calibration and shields are needed. Follow-up: How to make IR line following robust outdoors? Answer: Use active sensors with modulated IR and filters, or calibrate thresholds at start-up.',
'Easy'),

('Article 2: Sensors', 'Component: Touch/Bump Switch. Scenario: The robot''s bump switch sometimes registers a press when nothing touched it (false positives). Most likely reason?',
'["Switch wiring is loose or there''s mechanical vibration/noise", "Ghosts pressing the switch", "The battery changed polarity", "The LED is blinking"]',
'Switch wiring is loose or there''s mechanical vibration/noise',
'Loose contacts or vibration cause intermittent closure; debounce in code and secure mounting fix it. Follow-up: What is debounce and how is it done? Answer: Ignore changes for a short time after a press (software delay) or use hardware RC filtering.',
'Easy'),

('Article 2: Sensors', 'Component: Light sensor (LDR). Scenario: The light sensor reads correctly when held near a lamp but gives very low values when soldered in the circuit. Most likely cause?',
'["Wrong wiring or missing pull-up/pull-down resistor in voltage divider", "The LDR changed color", "The microcontroller hates light", "The wire is too long"]',
'Wrong wiring or missing pull-up/pull-down resistor in voltage divider',
'LDR needs to be in a divider to form measurable voltage; wrong wiring gives low readings. Follow-up: Sketch the simple circuit to read an LDR with an analog pin. Answer: Battery → LDR → analog pin → resistor → ground (or vice versa), forming divider.',
'Easy'),

('Article 2: Sensors', 'Component: IMU (Accelerometer/Gyro). Scenario: The IMU reports drifting angle values over time. Most likely reason?',
'["Gyroscope bias and lack of sensor fusion (no correction with accelerometer)", "IMU is being rude", "The antenna is weak", "Motors are too loud"]',
'Gyroscope bias and lack of sensor fusion (no correction with accelerometer)',
'Gyros integrate rotation and accumulate bias; fusion with accelerometer and filtering correct drift. Follow-up: Name a simple algorithm to fuse accelerometer + gyro. Answer: Complementary filter or Kalman filter (simpler: complementary for beginners).',
'Medium');

-- Article 3 questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 3: Motors & Movement', 'Component: DC Motor + Motor Driver. Scenario: The motor runs slowly under load even though voltage is correct. Most likely reason?',
'["Motor stalls because torque demand is higher than motor capability or battery voltage droops under load", "Motor dislikes heavy loads emotionally", "The motor needs Wi-Fi", "LED color affects speed"]',
'Motor stalls because torque demand is higher than motor capability or battery voltage droops under load',
'Under load, motors need torque; if gearing or motor rating is insufficient, or battery cannot supply enough current, speed drops. Follow-up: How to increase torque without changing motor? Answer: Use gearing (reduce output speed to increase torque) or reduce load.',
'Easy'),

('Article 3: Motors & Movement', 'Component: Servo Motor. Scenario: A servo jitterily moves to the commanded angle but can''t hold position under slight load. Most likely reason?',
'["Insufficient power supply (voltage sag) or servo is underspecified for the torque needed", "The servo forgot its training", "Serial monitor is full", "The breadboard is haunted"]',
'Insufficient power supply (voltage sag) or servo is underspecified for the torque needed',
'Servos need stable voltage and enough current; if underpowered they jitter and can''t hold. Follow-up: How to power several servos safely? Answer: Use an external regulated 5V supply with common ground and adequate current rating.',
'Easy'),

('Article 3: Motors & Movement', 'Component: Stepper Motor. Scenario: Stepper misses steps when speed increases. Most likely reason?',
'["Driving current too low or acceleration too high; torque falls at higher speeds", "The stepper prefers walking", "The stepper needs more code comments", "The motor driver speaks a different language"]',
'Driving current too low or acceleration too high; torque falls at higher speeds',
'Stepper torque decreases with speed; ensure driver current and gradual acceleration (ramping). Follow-up: What is microstepping and why use it? Answer: Microstepping divides full steps into smaller steps for smoother motion and higher resolution.',
'Medium'),

('Article 3: Motors & Movement', 'Component: Wheel & Traction. Scenario: Robot wheels spin but robot doesn''t move (slipping). Most likely reason?',
'["Low traction between wheel and ground (slippery surface) or gear slipping", "Robot is shy", "The motor is too honest", "The LED is too bright"]',
'Low traction between wheel and ground (slippery surface) or gear slipping',
'If wheels spin without translating motion, slip or mechanical failure is the cause. Follow-up: Name one fix to reduce wheel slip. Answer: Use grippier wheels, increase normal force, or add gear reduction to increase torque.',
'Easy'),

('Article 3: Motors & Movement', 'Component: Motor Noise & Back-EMF. Scenario: When motors run, microcontroller resets intermittently. Most likely reason?',
'["Electromagnetic interference and voltage spikes (back-EMF) from motors causing supply dips", "The microcontroller is tired", "The motor wants attention", "The LED blinks politely"]',
'Electromagnetic interference and voltage spikes (back-EMF) from motors causing supply dips',
'Motors generate noise and spikes; without proper suppression and supply decoupling MCU can reset. Follow-up: Name one hardware and one software mitigation for motor noise. Answer: Hardware: add capacitors/TVS and separate supply; Software: add brownout detection and graceful restart.',
'Medium');

-- Continue with remaining articles (4-10) following same pattern
-- Article 4: Power & Batteries
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 4: Power & Batteries', 'Component: Battery Capacity / Voltage Sag. Scenario: Robot starts fine but after a short time motors slow and behavior degrades. Most likely reason?',
'["Battery voltage is sagging because capacity is low or battery internal resistance is high", "The code got bored", "The robot reached the edge of Earth", "The motors are learning to dance"]',
'Battery voltage is sagging because capacity is low or battery internal resistance is high',
'Voltage drop under load reduces motor torque and MCU voltage, degrading performance. Follow-up: What battery spec should you check to avoid this? Answer: The battery''s discharge rate (C) and internal resistance, and mAh capacity.',
'Easy'),

('Article 4: Power & Batteries', 'Component: Voltage Regulator. Scenario: Motors are powered directly from battery at 9V but the microcontroller needs 5V; powering the microcontroller directly causes instability. Best reason?',
'["Microcontroller needs stable regulated 5V; connecting to 9V without regulator damages it or makes it unstable", "Microcontroller prefers 9V food", "The regulator is shy", "9V is prettier"]',
'Microcontroller needs stable regulated 5V; connecting to 9V without regulator damages it or makes it unstable',
'MCU must be within rated voltage; use a regulator or buck converter to step down 9V to 5V. Follow-up: What kind of regulator is efficient for battery-powered robots? Answer: A switching buck regulator (DC-DC converter) for efficiency.',
'Easy'),

('Article 4: Power & Batteries', 'Component: Power Connectors & Polarity. Scenario: When you connect the battery the robot won''t power on and the regulator gets hot. Likely cause?',
'["Reverse polarity (battery connected backwards) or short circuit causing heat", "The battery is shy", "The robot needs more stickers", "The regulator misread the manual"]',
'Reverse polarity (battery connected backwards) or short circuit causing heat',
'Reversed connections cause heat and damage; check polarity and fuses. Follow-up: What safety part prevents damage from reverse connection? Answer: Use a diode or reverse-polarity protection circuit or fuse.',
'Easy'),

('Article 4: Power & Batteries', 'Component: Battery Charging & Cells. Scenario: Rechargeable battery stops accepting charge quickly and runtime decreases. Likely reason?',
'["Battery cells have aged or one cell failed", "The charger is shy", "The robot didn''t study enough", "Solar flares"]',
'Battery cells have aged or one cell failed',
'Battery capacity drops with use/age; cells can fail causing quick charge loss. Follow-up: What maintenance prevents early battery failure? Answer: Use proper charging cycles, avoid deep discharge, store at recommended voltage/temperature.',
'Easy'),

('Article 4: Power & Batteries', 'Component: Power Distribution. Scenario: The microcontroller and sensors get noisy readings only when motors run. Most likely cause?',
'["Motors draw large currents on same rail causing voltage drops and noise; need separate supply or decoupling", "Sensors are visual artists", "The microcontroller needs coffee", "Wheels are too fast"]',
'Motors draw large currents on same rail causing voltage drops and noise; need separate supply or decoupling',
'Shared power lines without isolation cause noise; proper decoupling or separate supplies help. Follow-up: Name one practice to isolate motor noise from logic circuits. Answer: Use separate power rails or add LC filters and decoupling capacitors.',
'Medium');

-- Article 5-10 questions (continuing with same comprehensive pattern)
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 5: Programming Basics', 'Component: Loop & Delay. Scenario: A program uses delay() for long waits; while waiting the robot can''t read sensors or respond. Robot becomes unresponsive. Most likely reason?',
'["Using blocking delay() prevents reading sensors; program can''t multitask", "The robot is lazy", "Delay makes wiring melt", "The battery hates delays"]',
'Using blocking delay() prevents reading sensors; program can''t multitask',
'Blocking delays stop the main loop; use non-blocking timers or state machines for responsiveness. Follow-up: Name a non-blocking technique to replace delay(). Answer: Use millis() timing or implement a simple state machine.',
'Easy'),

('Article 5: Programming Basics', 'Component: Conditional Logic (if/else). Scenario: Robot should turn left when left sensor detects dark line, but sometimes it turns wrong. Most likely reason?',
'["Incorrect condition order or threshold logic in if/else block", "The line changed mind", "The robot prefers right turns", "The battery reversed"]',
'Incorrect condition order or threshold logic in if/else block',
'Wrong thresholds or swapped conditions cause wrong decisions; check logic and sensor calibration. Follow-up: Suggest one test to debug the logic. Answer: Print sensor values via serial and check conditions against real readings.',
'Easy'),

('Article 5: Programming Basics', 'Component: Variable Types & Overflow. Scenario: A timing calculation uses an int counter and after a long run the timing is wrong. Most likely cause?',
'["Integer overflow or using wrong type for time; use unsigned long for millis() computations", "The integer is shy", "The robot likes floats more", "The sensor is jealous"]',
'Integer overflow or using wrong type for time; use unsigned long for millis() computations',
'millis() returns large values; using int can overflow causing wrong timing. Follow-up: What type is safe for time values on Arduino? Answer: unsigned long.',
'Easy'),

('Article 5: Programming Basics', 'Component: Function Decomposition. Scenario: Program is huge single block and difficult to debug; small changes create many problems. Best engineering reason?',
'["Lack of modular functions; code needs decomposition for readability and testing", "The robot hates comments", "The microcontroller wants more friends", "The LED is bored"]',
'Lack of modular functions; code needs decomposition for readability and testing',
'Split into functions (readSensor(), drive(), decide()) to test each part separately. Follow-up: Name one advantage of breaking code into functions. Answer: Easier testing, reuse, and readability.',
'Easy'),

('Article 5: Programming Basics', 'Component: Serial Debugging. Scenario: Robot behaves oddly; you don''t know why because there are no printouts. Most likely reason?',
'["Lack of serial debug statements to inspect internal values", "The robot is shy", "The serial monitor is banned", "The microcontroller is telepathic"]',
'Lack of serial debug statements to inspect internal values',
'Serial prints reveal sensor and variable values to diagnose logic/hardware issues. Follow-up: What is one safe way to add debug prints without breaking timing? Answer: Print at low frequency or use conditional debug flags; avoid heavy prints in tight loops.',
'Easy');

-- Continue with Articles 6-10 (abbreviated for space, following same pattern)
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty) VALUES
('Article 6: Mechanical Design', 'Component: Gear Ratio. Scenario: Robot needs to climb a ramp but it stalls and can''t move up. Most likely reason?',
'["Gear ratio provides too much speed and too little torque; need reduction gear for more torque", "The ramp is too polite", "The motor hates hills", "The battery is in French"]',
'Gear ratio provides too much speed and too little torque; need reduction gear for more torque',
'For climbing, torque is key; change gearing to amplify torque at the wheel. Follow-up: Is increasing wheel diameter a good way to increase climbing torque? Answer: No — larger wheels increase required torque; reducing gearing is better.',
'Medium'),

('Article 7: Control Logic', 'Component: On/Off Control (Bang-bang). Scenario: Line follower uses bang-bang control and oscillates across the line. Most likely reason?',
'["Bang-bang is too coarse; needs proportional control or smoothing", "The line is dancing", "The motors are in love", "The floor is jealous"]',
'Bang-bang is too coarse; needs proportional control or smoothing',
'Bang-bang flips quickly between states; proportional control reduces oscillation. Follow-up: Name a simple improvement over bang-bang for line following. Answer: Implement proportional (P) control or add smoothing on sensor readings.',
'Medium'),

('Article 8: Diagnostics', 'Component: Isolation Testing. Scenario: The full robot misbehaves; tests show the sensor works on bench but fails in the robot. Best initial diagnostic step?',
'["Check wiring/power under load and mechanical mounting; reproduce failure in integration", "Rewrite entire code randomly", "Replace the world", "Blame the sensor immediately"]',
'Check wiring/power under load and mechanical mounting; reproduce failure in integration',
'Integration issues often caused by wiring/power/mounting that don''t appear on bench tests. Follow-up: What measurement could reveal power drop during integration? Answer: Measure voltage at sensor connector while robot runs.',
'Medium'),

('Article 9: Safety', 'Component: Emergency Stop (E-stop). Scenario: Robot continues moving when someone presses stop button. Most likely cause?',
'["E-stop wiring or logic not wired into motor power cutoff", "The stop button is decorative", "The robot wanted to finish its song", "The battery ignores buttons"]',
'E-stop wiring or logic not wired into motor power cutoff',
'E-stop must cut motor power or command immediate safe stop; if wired only to MCU input it may not stop if MCU is hung. Follow-up: How to ensure E-stop works even if MCU freezes? Answer: Use a hardware power cutoff (relay/MOSFET) controlled by the E-stop, independent of MCU.',
'Medium'),

('Article 10: Integration', 'Component: Subsystem Integration. Scenario: Individually sensors, motors, and code work, but full system fails with timing issues. Likely cause?',
'["Integration introduced timing/resource conflicts requiring redesign of loop or priority", "The robot prefers solitude", "Components hold grudges", "The lab has bad vibes"]',
'Integration introduced timing/resource conflicts requiring redesign of loop or priority',
'Integration surfaces interactions; prioritize tasks, avoid blocking calls, and schedule sensor reads appropriately. Follow-up: Give one strategy to manage multiple tasks in microcontroller. Answer: Use non-blocking code with millis() or a simple cooperative scheduler.',
'Hard');