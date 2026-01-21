package at.htlleonding.tran.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;


@JsonIgnoreProperties(ignoreUnknown = true)
public record ProviderApi(
        Long id,
        String provider_name,
        String logo_path,
        Map<String, Integer> display_priorities
) {}
