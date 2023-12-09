package com.algolovers.newsletterconsole.config.security.filters;

import com.algolovers.newsletterconsole.utils.Constants;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;

@Component
@Order(1)
public class IndexUrlFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String requestURI = req.getRequestURI();

        for(String allowedUri: Constants.UNAUTHORIZED_NONSTATIC_API) {
            if(requestURI.startsWith(allowedUri)){
                chain.doFilter(request, response);
                return;
            }
        }

        if (Objects.equals(requestURI, "/")) {
            chain.doFilter(request, response);
            return;
        }

        request.getRequestDispatcher("/").forward(request, response);
    }
}
