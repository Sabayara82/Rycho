package models

import (
	"sync"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	instance *User
	once     sync.Once
)

func GetUserInstance() *User {
	once.Do(func() {
		instance = &User{}
	})
	return instance
}

type User struct {
	Id             primitive.ObjectID `json:"id,omitempty"`
	Name           string             `json:"name,omitempty" validate:"required"`
	EmailAddress   string             `json:"emailaddress,omitempty" validate:"required"`
	Password       string             `json:"password,omitempty" validate:"required"`
	ProfilePicture string             `json:"profilepicture,omitempty"`
	Friends        []User             `json:"friends,omitempty"`
	Followers      []User             `json:"followers,omitempty"`
}

func NewUser() *User {
	return GetUserInstance()
}
