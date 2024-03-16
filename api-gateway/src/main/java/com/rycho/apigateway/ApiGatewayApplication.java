package com.rycho.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGatewayApplication {
// changing the following code once the api endpoints are provided 
	// @Bean
	// public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
	// return builder.routes()
	// 	.route("service1", r -> r.path("/service1/**")
	// 	.filters(f -> f.stripPrefix(1))
	// 	.uri("lb://SERVICE-NAME1"))
	// 	.route("service2", r -> r.path("/service2/**")
	// 	.filters(f -> f.stripPrefix(1))
	// 	.uri("lb://SERVICE-NAME2"))
	// 	.build();
	// }

	// public static void main(String[] args) {
	// 	SpringApplication.run(ApiGatewayApplication.class, args);
	// }

}


