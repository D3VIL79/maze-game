import cv2
import mediapipe as mp
import pygame
import numpy as np
import math
import random

# Initialize MediaPipe Hands model and drawing utilities
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Function to draw a stick with one end fixed on the screen and the other end at the index finger tip
def draw_stick(image, index_finger_tip):
    fixed_end = (image.shape[1] - 150, image.shape[0] - 150)  # Fixed end position on the screen

    # Calculate the stick's angle and endpoint
    index_tip_x = int(index_finger_tip.x * image.shape[1])
    index_tip_y = int(index_finger_tip.y * image.shape[0])
    
    # Draw the stick
    cv2.line(image, fixed_end, (index_tip_x, index_tip_y), (0, 255, 0), 5)
    cv2.circle(image, fixed_end, 10, (0, 0, 255), -1)  # Draw the stick base
    cv2.circle(image, (index_tip_x, index_tip_y), 10, (255, 0, 0), -1)  # Draw the stick end

# Function to detect the stick position for movement (left hand)
def detect_stick_movement(index_finger_tip, frame):
    fixed_end = (frame.shape[1] - 150, frame.shape[0] - 150)
    index_tip_x = int(index_finger_tip.x * frame.shape[1])
    index_tip_y = int(index_finger_tip.y * frame.shape[0])

    # Horizontal line check (for forward/reverse movement)
    if index_tip_y < fixed_end[1]:  # Above the fixed horizontal line
        return "Forward"
    elif index_tip_y > fixed_end[1]:  # Below the fixed horizontal line
        return "Reverse"
    return None

# Function to detect the stick's side for rotation (right hand)
def detect_hand_rotation(index_finger_tip, frame):
    fixed_end = (frame.shape[1] - 150, frame.shape[0] - 150)  # Fixed point of the stick
    index_tip_x = int(index_finger_tip.x * frame.shape[1])
    
    # Check if index finger is on the left or right of the fixed point
    if index_tip_x < fixed_end[0]:
        return "Left Turn"
    elif index_tip_x > fixed_end[0]:
        return "Right Turn"
    return None

# Function to detect hand gestures and control car movement or rotation
def detect_hand_gesture(hand_landmarks, hand_label, frame):
    landmarks = hand_landmarks.landmark
    index_finger_tip = landmarks[8]

    if hand_label == "Left":
        return detect_stick_movement(index_finger_tip, frame)
    
    if hand_label == "Right":
        return detect_hand_rotation(index_finger_tip, frame), index_finger_tip
    
    return None

# Function to handle car movement on a Pygame window with boundary constraints
def animate_car_movement(gesture, car_rect, car_speed, screen_width, screen_height, walls, maze, cell_size):
    new_rect = car_rect.copy()  # Store the initial position to revert in case of collision

    if gesture == "Forward":
        new_rect.y -= car_speed
    elif gesture == "Reverse":
        new_rect.y += car_speed

    # Check if the new position is within maze bounds and not on a wall
    new_cell_x, new_cell_y = new_rect.x // cell_size, new_rect.y // cell_size
    if maze[new_cell_y, new_cell_x] == 1:
        return car_rect  # Blocked by wall, return original position

    # Constrain the car to the screen boundaries
    new_rect.x = max(0, min(new_rect.x, screen_width - car_rect.width))
    new_rect.y = max(0, min(new_rect.y, screen_height - car_rect.height))

    # Collision detection with walls
    if new_rect.collidelist(walls) != -1:
        return car_rect  # If there's a collision, revert to the initial position

    return new_rect

# Function to handle car rotation based on stick rotation
def handle_car_rotation(turn_direction, car_rect, car_speed, screen_width, screen_height, walls):
    new_rect = car_rect.copy()

    if turn_direction == "Left Turn":  # Left turn
        new_rect.x -= car_speed
    elif turn_direction == "Right Turn":  # Right turn
        new_rect.x += car_speed

    # Constrain the car to the screen boundaries
    new_rect.x = max(0, min(new_rect.x, screen_width - car_rect.width))
    new_rect.y = max(0, min(new_rect.y, screen_height - car_rect.height))

    # Collision detection with walls
    if new_rect.collidelist(walls) != -1:
        return car_rect  # If there's a collision, revert to the initial position

    return new_rect

# Function to generate a rectangular labyrinth (maze) with a guaranteed solution
def generate_rectangular_labyrinth(width, height, cell_size):
    rows = height // cell_size
    cols = width // cell_size
    maze = np.ones((rows, cols), dtype=np.uint8)  # Start with walls everywhere

    def is_valid(x, y):
        return 0 <= x < rows and 0 <= y < cols

    def remove_walls(x1, y1, x2, y2):
        maze[(x1 + x2) // 2, (y1 + y2) // 2] = 0
        maze[x2, y2] = 0

    def recursive_backtracking(x, y):
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        random.shuffle(directions)
        for dx, dy in directions:
            nx, ny = x + dx * 2, y + dy * 2
            if is_valid(nx, ny) and maze[nx, ny] == 1:
                remove_walls(x, y, nx, ny)
                recursive_backtracking(nx, ny)

    # Start the maze generation from a random cell
    start_x, start_y = random.randint(0, rows - 1) // 2 * 2, random.randint(0, cols - 1) // 2 * 2
    recursive_backtracking(start_x, start_y)

    maze[0, 0] = 0  # Ensure start is clear
    maze[rows - 1, cols - 1] = 0  # Ensure exit is clear

    return maze

# Function to draw maze and exit
def draw_maze(screen, maze, cell_size):
    maze_color = (0, 0, 255)  # Blue for walls
    walls = []

    height, width = maze.shape
    for i in range(height):
        for j in range(width):
            if maze[i, j] == 1:
                wall_rect = pygame.Rect(j * cell_size, i * cell_size, cell_size, cell_size)
                walls.append(wall_rect)
                pygame.draw.rect(screen, maze_color, wall_rect)

    exit_rect = pygame.Rect(width * cell_size - 40, height * cell_size - 40, 40, 40)
    pygame.draw.rect(screen, (255, 0, 0), exit_rect)  # Draw exit

    return walls, exit_rect

# Main function to capture video, process gestures, and animate car
def main():
    # Initialize Pygame
    pygame.init()
    screen_width, screen_height = 640, 480
    cell_size = 20  # Size of each cell in the maze (adjusted for a more challenging maze)
    screen = pygame.display.set_mode((screen_width, screen_height))
    pygame.display.set_caption("Car Animation")

    # Define car circle properties
    car_radius = 5
    car_color = (0, 255, 0)
    car_rect = pygame.Rect(0, 0, car_radius * 2, car_radius * 2)
    car_speed = 3

    # Capture video from webcam
    cap = cv2.VideoCapture(0)

    level = 1
    max_level = 100

    maze = generate_rectangular_labyrinth(screen_width, screen_height, cell_size)

    with mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5) as hands:
        while cap.isOpened():
            ret, image = cap.read()
            if not ret:
                break

            image = cv2.flip(image, 1)  # Flip the image horizontally
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Process the image and find hands
            results = hands.process(image_rgb)

            # Initialize gesture to None
            gesture = None

            # Draw hand annotations
            if results.multi_hand_landmarks:
                for hand_landmarks, hand_label in zip(results.multi_hand_landmarks, results.multi_handedness):
                    gesture = detect_hand_gesture(hand_landmarks, hand_label.classification[0].label, image)
                    if gesture and isinstance(gesture, str):
                        car_rect = animate_car_movement(gesture, car_rect, car_speed, screen_width, screen_height, walls, maze, cell_size)
                    elif gesture and isinstance(gesture, tuple):
                        turn_direction, index_finger_tip = gesture
                        draw_stick(image, index_finger_tip)
                        car_rect = handle_car_rotation(turn_direction, car_rect, car_speed, screen_width, screen_height, walls)

                    mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Display the camera feed with annotations
            cv2.putText(image, f"Level: {level}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.putText(image, f"Gesture: {gesture}" if gesture else "Gesture: None",
                        (image.shape[1] - 250, image.shape[0] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.imshow('Hand Gesture Detection', image)

            # Clear the screen and draw maze and car
            screen.fill((0, 0, 0))
            walls, exit_rect = draw_maze(screen, maze, cell_size)
            pygame.draw.circle(screen, car_color, car_rect.center, car_radius)

            # Update display
            pygame.display.flip()

            # Check if car has reached the exit
            if car_rect.colliderect(exit_rect):
                print(f"Level {level} completed!")
                if level < max_level:
                    level += 1
                    car_rect.topleft = (0, 0)
                    maze = generate_rectangular_labyrinth(screen_width, screen_height, cell_size)
                    pygame.time.wait(1000)
                else:
                    print("Congratulations! You've completed all levels.")
                    break

            # Handle Pygame quit event
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    cap.release()
                    pygame.quit()
                    cv2.destroyAllWindows()
                    return

            # Break loop on 'Esc' key
            if cv2.waitKey(1) & 0xFF == 27:
                break

    cap.release()
    pygame.quit()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
