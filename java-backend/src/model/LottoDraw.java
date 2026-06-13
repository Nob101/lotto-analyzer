package model;

import java.util.HashSet;
import java.util.Set;

public class LottoDraw {
    private final int[] mainNumbers;
    private final int additionalNumber;

    public LottoDraw(int[] mainNumbers, int additionalNumber) {
        if (mainNumbers == null || mainNumbers.length != 6) {
            throw new IllegalArgumentException("Es muessen genau 6 Hauptzahlen sein.");
        }
        
        this.mainNumbers = mainNumbers;
        this.additionalNumber = additionalNumber;
        validate();
    }

    private void validate() {
        Set<Integer> uniqueNumbers = new HashSet<>();
        
        for (int num : mainNumbers) {
            if (num < 1 || num > 45) {
                throw new IllegalArgumentException("Lottozahlen muessen zwischen 1 and 45 liegen: " + num);
            }
            if (!uniqueNumbers.add(num)) {
                throw new IllegalArgumentException("Doppelte Zahl gefunden: " + num);
            }
        }
        
        if (additionalNumber < 1 || additionalNumber > 45) {
            throw new IllegalArgumentException("Die Zusatzzahl muss zwischen 1 und 45 liegen.");
        }
        if (uniqueNumbers.contains(additionalNumber)) {
            throw new IllegalArgumentException("Die Zusatzzahl darf keine der Hauptzahlen sein.");
        }
    }

    public int[] getMainNumbers() {
        return mainNumbers;
    }

    public int getAdditionalNumber() {
        return additionalNumber;
    }
}