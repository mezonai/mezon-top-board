# Mezon Top Board project
## Description
This project is for listing applications for the Mezon platform, similar to top.mezon.ai and Mezon.

## Prerequisites
- Docker installed

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/nccasia/mezon-top-board.git
    ```
2. Navigate to the project directory:
    ```sh
    cd mezon-top-board
    ```
3. Create .env file: (sample in .env.sample)

## Usage (Manual)
1. Install node version 22.
2. Install postgres server local.
3. Create .env file for each folder (frontend and backend, follow the sample in .env.sample)
4. Run `./install_pacakge_local.sh` or manually cd to each folder and run `yarn`
5. Change workdir to the directory you wanna run and run `yarn dev`

## Usage (Docker)
### Development mode
1. Start the development server:

    **If you're using docker-compose:**

    ```sh
    docker-up.sh --build --debug
    ```

    **If you're using docker core (`docker compose`):**

    ```sh
    docker-up.sh --build --debug --core
    ```

2. Open your browser and go to `http://localhost:3000` (frontend) / `http://localhost:8123` (backend).

### Production mode
1. Start the production server:

    **If you're using docker-compose:**

    ```sh
    docker-up.sh --build
    ```

    **If you're using docker core (`docker compose`):**

    ```sh
    docker-up.sh --build --core
    ```

2. Open your browser and go to `http://localhost` (frontend) / `http://localhost:8778` (backend).

## Contributing
1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a pull request.

## License
This project is licensed under the [MIT](LICENSE) License.