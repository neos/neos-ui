port module ElmCheckBox exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Flags =
    { isChecked : Bool
    , isDisabled : Maybe Bool
    , highlight : Maybe Bool
    , className : Maybe String
    }


type alias Model =
    { isChecked : Bool
    , isDisabled : Bool
    , highlight : Bool
    , className : String
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        isChecked =
            flags.isChecked

        isDisabled =
            case flags.isDisabled of
                Just disabled ->
                    True

                Nothing ->
                    False

        highlight =
            case flags.highlight of
                Just highlight ->
                    True

                Nothing ->
                    False

        className =
            case flags.className of
                Just className ->
                    className

                Nothing ->
                    ""
    in
    ( { isChecked = isChecked
      , isDisabled = isDisabled
      , highlight = highlight
      , className = className
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = OnClick


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnClick ->
            ( { model | isChecked = not model.isChecked }, Cmd.batch [ handleClick model.isChecked ] )


port handleClick : Bool -> Cmd msg



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


myStyle : Attribute msg
myStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "50%" )
        , ( "left", "0" )
        , ( "z-index", "3" )
        , ( "transform", "translateY(-50%)" )
        , ( "width", "20px" )
        , ( "height", "20px" )
        , ( "opacity", "0" )
        , ( "cursor", "pointer" )
        ]


view : Model -> Html Msg
view model =
    input [ myStyle, type_ "checkbox", checked model.isChecked, disabled model.isDisabled, onClick OnClick ] []
