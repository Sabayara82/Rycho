package main

import (
	"go-mongodb/configs"
	"go-mongodb/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	configs.ConnectDB()
	router.Use(cors.Default())
	routes.UserRoute(router)
	//routes.GroupRoute(router)
	router.Run("localhost:5000")
}
