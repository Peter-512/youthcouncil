package be.kdg.youthcouncil.config.security;

import be.kdg.youthcouncil.config.security.Oauth.OAuthLoginSuccessHandler;
import be.kdg.youthcouncil.service.userService.CustomOAuth2UserService;
import be.kdg.youthcouncil.service.userService.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;


@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class WebSecurityConfig {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	private CustomOAuth2UserService oauthUserService;
	private UserService userService;
	private OAuthLoginSuccessHandler oauthLoginSuccessHandler;


	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		logger.debug("filterChain setup");
		http
				.httpBasic()
				.and()
				.csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
				.and()
				.authorizeRequests(auths -> auths
						.antMatchers("/").permitAll()
						.antMatchers("/login").permitAll()
						.antMatchers(HttpMethod.GET, "/js/**", "/css/**", "/webjars/**", "/favicon.ico").permitAll()
						.antMatchers("/register").permitAll()
						.antMatchers("/oauth/**").permitAll()
						.anyRequest().authenticated())
				.formLogin()
				.loginPage("/login")
				.permitAll()
				.and()
				.logout()
				.permitAll()
				.and()
				.oauth2Login()
				.loginPage("/login")
				.userInfoEndpoint()
				.userService(oauthUserService)
				.and()
				.successHandler(oauthLoginSuccessHandler);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}


}
