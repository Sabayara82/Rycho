package routes

import (
	"go-mongodb/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {
	// User Routes
	router.POST("/users", controllers.CreateUser())
	router.GET("/users/:id", controllers.GetUser())
	router.PUT("/users/:id", controllers.UpdateUser())
	router.GET("/users/search", controllers.SearchUsers())
	router.DELETE("/users/:id", controllers.DeleteUser())
	router.GET("/users", controllers.ListUsers())
}
