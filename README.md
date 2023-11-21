# Platforma konkursowa dla fundacji BoWarto


## Krótki opis
TODO opis


## Konfiguracja środowiska
W projekcie korzystamy z Pipenv, który jest narzędziem do zarządzania zależnościami w projekcie Pythona, łączące w sobie funkcje pip (do instalacji pakietów) i virtualenv (do izolowania środowiska).

1. **Instalacja Pipenv**: Upewnij się, że masz zainstalowany Python w wersji większej niż 3.7, a następnie zainstaluj Pipenv za pomocą polecenia pip:

    ```bash
    pip install pipenv
    ```

2. **Inicjacja projektu**: Przejdź do głównego katalogu swojego projektu w terminalu i uruchom:

    ```bash
    pipenv install
    ```

    Komenda ta z wykorzystaniem `Pipfile` stworzy odpowiednie środowisko wirtualne do pracy z projektem.
    

3. **Aktywacja środowiska wirtualnego**: Aby aktywować środowisko wirtualne stworzone przez Pipenv, użyj:

    ```bash
    pipenv shell
    ```

4. **Uruchamianie skryptów**: Aby uruchomić skrypty w środowisku Pipenv, użyj:

    ```bash
    pipenv run nazwa_skryptu.py
    ```

    lub jeśli aktywne jest środowisko po wcześniejszeym użyciu `pipenv shell`, po prostu
        ```bash
    python nazwa_skryptu.py

5. **Dezaktywacja środowiska wirtualnego**: Aby wyjść z wirtualnego środowiska, użyj komendy:

    ```bash
    exit
    ```

5. **Instalacja pakietów**: W celu instalacji pakietów i tym samym dodawania ich do paczki użyj komendy

    ```bash
    pipenv install nazwa_pakietu
    ```
    Wykonanie tej komendy zmieni Pipfile i Pipfile.lock. Możesz również wprowadzać ręczne zmiany do Pipfile, lecz pamiętaj, by każdorazowo po takowej zmianie uruchamiać komendę `pipenv install` by wygenerować `Pipfile.lock` i stworzyć odpowiednie, aktualne środowisko.


Pamiętaj, że plik `Pipfile.lock` automatycznie zapisuje dokładne wersje zainstalowanych pakietów, aby zapewnić spójność środowiska na różnych maszynach. Przy kolejnych uruchomieniach projektu, zaleca się używanie poleceń `pipenv install` w celu zainstalowania zależności zdefiniowanych w pliku `Pipfile`.

## Konwencja
Dokumentacja, docstringi, komentarze - po polsku

Kod, pliki - po angielsku

zmienne, metody - snake_case

klasy - PascalCase