package at.htlleonding.tran.dto;

import java.util.List;
import java.util.Set;

public class ProviderUpdateRequest {
    private List<String> toAdd;
    private List<String> toRemove;

    public List<String> getToAdd() {
        return toAdd;
    }

    public void setToAdd(List<String> toAdd) {
        this.toAdd = toAdd;
    }

    public List<String> getToRemove() {
        return toRemove;
    }

    public void setToRemove(List<String> toRemove) {
        this.toRemove = toRemove;
    }

    // Getter/Setter
}
