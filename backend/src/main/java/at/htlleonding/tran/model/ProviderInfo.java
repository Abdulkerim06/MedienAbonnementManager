package at.htlleonding.tran.model;

// Hilfsklasse für saubere JSON-Ausgabe
public class ProviderInfo {
    private String name;
    private String logoUrl;
    private boolean ownedByUser; // <-- neu

    public ProviderInfo(String name, String logoUrl) {
        this.name = name;
        this.logoUrl = logoUrl;
    }

    public ProviderInfo(String name, String logoUrl, boolean ownedByUser) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.ownedByUser = ownedByUser;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public boolean isOwnedByUser() {
        return ownedByUser;
    }

    public void setOwnedByUser(boolean ownedByUser) {
        this.ownedByUser = ownedByUser;
    }
}
