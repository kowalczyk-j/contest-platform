# Platforma konkursowa dla fundacji BoWarto


## Cel projektu
Implementacja internetowej platformy konkursowej do rejestracji zgłoszeń uczestników, które zawierają prace artystyczne. Aplikacja webowa umożliwi właścicielom fundacji "Bo Warto" powiadomienie odbiorców z bazy mailingowej o nowym konkursie, zarządzanie trwającymi konkursami, weryfikację formularzy zgłoszeniowych, ocenę prac i generowanie statystyk. System ma być dostępny po przekierowaniu z zakładki istniejącej już strony www.fundacjabowarto.pl.


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

## Uruchomienie serwera
W projekcie backend piszemy w Django. Aby uruchomić serwer Django, wykonaj następujące kroki:


1. **Migracje bazy danych**: Wykonaj migracje, aby zastosować zmiany w bazie danych:

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

2. **Uruchomienie serwera**: Aby uruchomić serwer deweloperski, wpisz poniższą komendę:

    ```
    python manage.py runserver
    ```

    Serwer będzie dostępny pod adresem domyślnym `http://127.0.0.1:8000/`.

3. **Otwórz aplikację w przeglądarce**: Wejdź na `http://127.0.0.1:8000/` w przeglądarce internetowej, aby zobaczyć działającą aplikację Django.


4. **Zmiana portu**:Możesz zmienić port, na którym działa serwer, dodając parametr `-p` lub `--port`. Na przykład, aby uruchomić serwer na porcie 8080, wpisz:

    ```
    python manage.py runserver 8080
    ```

- W trybie deweloperskim serwer automatycznie przeładowuje się po wprowadzeniu zmian w kodzie, więc nie musisz ręcznie ponownie uruchamiać serwera za każdym razem.

## Konwencja
Dokumentacja, docstringi, komentarze - w języku polskim

Kod i nazwy plików - w języku angielskim

Nazwy zmiennych i metod - snake_case

Nazwy klas - PascalCase

test commitów w jira