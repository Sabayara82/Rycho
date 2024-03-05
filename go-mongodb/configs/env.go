package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

//This function just gets .env file content
func EnvMongoURI() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("MONGOURI")
}
