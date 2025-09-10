package at.htlleonding.tran.dto;

public class ProviderInfoDTO {
    private String name;
    private String logoUrl;
    private boolean ownedByUser;


    public ProviderInfoDTO() {} // Default-Konstruktor wichtig für Jackson

    public ProviderInfoDTO(String name, String logoUrl) {
        this.name = name;
        this.logoUrl = logoUrl;
    }

    public ProviderInfoDTO(String name, String logoUrl, Boolean ownedByUser) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.ownedByUser = ownedByUser;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public boolean isOwnedByUser() {
        return ownedByUser;
    }

    public void setOwnedByUser(boolean ownedByUser) {
        this.ownedByUser = ownedByUser;
    }
}
